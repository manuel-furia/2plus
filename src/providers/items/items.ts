import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { MediaListingResponseEntry } from '../../interfaces/mediaListingResponseEntry';
import { User } from '../../interfaces/user';
import { Item } from "../../interfaces/item";
import { ConfigProvider } from "../config/config";
import { Observable } from "rxjs";
import { UserProvider } from "../users/user";
import { MediaProvider } from "../media/media";
import { MediaResponse } from "../../interfaces/mediaResponse";
import { ItemDescriptors } from "../../interfaces/itemDescriptors";
import { MediaUpdateRequest } from "../../interfaces/mediaUpdateRequest";
import { StorageProvider } from "../storage/storage";
import { NotificationResponse } from "../../interfaces/notificationResponse";
import { ImageFilters } from "../../interfaces/imageFilters";
import { ItemUploadInfo } from "../../interfaces/itemUploadInfo";
import { GeoLocation } from "../../interfaces/geoLocation";
import { MediaDescriptors } from "../../interfaces/mediaDescriptors";
import { UriUtils } from "../utils/uriUtils";
import { UploadMediaResponse } from "../../interfaces/uploadMediaResponse";

/**
 * Provide information about items for sale/free.
 */
@Injectable()
export class ItemsProvider {

  constructor(private http: HttpClient,
              private alertController: AlertController,
              private toastCtrl: ToastController,
              private config: ConfigProvider,
              private users: UserProvider,
              private mediaProvider: MediaProvider,
              private userSession: StorageProvider,
              private uriUtils: UriUtils) { }

  /**
   * Get all the items relevant to this app (tagged with 2plus).
   *
   * @return all the items that are tagged with a specific tag
   */
  public getRelevantItems(): Observable<Item[]> {
    return this.getItems(this.config.getAppTag());
  }

  /**
   * Get all the items that are tagged with a specific tag.
   *
   * @param tag the tag
   * @return all the items that are tagged with a specific tag
   */
  public getItems(tag: String): Observable<Item[]> {
    return this.mediaProvider.getMediaListingsByTag(this.config.getAppItemTag()).flatMap(medias => {
      const items = medias
        .map(media => {
          const descriptors = this.getDescriptors(media);
          if (descriptors !== null)
            return this.buildItem(media, descriptors);
          else return null;
        })
        //The transpiler is not smart enough to cast Observable<Item | null> to Observable<Item> after the null check
        .filter(elem => elem !== null) as Observable<Item>[];
      return Observable.zip(...items);
    });
  }

  /**
   * Return one item given its ID.
   *
   * @param item_id
   */
  public getItem(item_id: number): Observable<Item | null> {
    return this.mediaProvider.queryDetailedMediaInfo(item_id).flatMap(mediaResponse => {
        const descriptors = this.getDescriptors(mediaResponse);
        if (descriptors !== null)
          return this.buildItem(mediaResponse, descriptors);
        else
          return Observable.of(null);
      });
  }

  /**
   * Get all items of a user.
   *
   * @return all the items that have been created by the current user
   */
  public getItemsOfCurrentUser(): Observable<Item[]> {
    return this.mediaProvider.getAllMediaListingsOfCurrentUser().flatMap(medias => {
      const items = medias
        .map(media => {
          const descriptors = this.getDescriptors(media);
          if (descriptors !== null)
            return this.buildItem(media, descriptors);
          else return null;})
        //The transpiler is not smart enough to cast Observable<Item | null> to Observable<Item> after the null check
        .filter(elem => elem !== null) as Observable<Item>[];
      console.log(medias);
      console.log(items);
      return Observable.zip(...items);
    });
  }

  /**
   * Update the title and description of an item.
   *
   * @param item_id the id of the item to modify
   * @param data the new information
   * @return a notification response from the server
   */
  updateItemInfo(item_id: number, data:MediaUpdateRequest){
    const modifyFilePath:string = "http://media.mw.metropolia.fi/wbma/media/"+item_id;
    let accessToken = this.userSession.loadSessionToken() || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': accessToken
      }),
    };
    return this.http.put<NotificationResponse>(modifyFilePath, data, httpOptions);
  }

  public uploadItem(itemInfo: ItemUploadInfo): Observable<UploadMediaResponse>{
    const uploadedMedias = itemInfo.medias.map(
      media => {
        const descriptors = <MediaDescriptors>{filters: media.filter, isImage: media.file.type.includes('image')};
        return this.mediaProvider.uploadMedia({file: media.file, description: JSON.stringify(descriptors), title: ''}, this.config.getAppTag())
      });

    return Observable.zip(...uploadedMedias).flatMap(responses => {
      console.log(responses);
      const mediaIds = responses.map(response => response.file_id);
      const descriptors =  <ItemDescriptors>{
        description: itemInfo.description,
        media_ids: mediaIds,
        price: itemInfo.price,
        city: {city: itemInfo.location, country: 'FI'},
        category: itemInfo.category,
        discriminator: 'ItemDescriptors'
      };
      const description = JSON.stringify(descriptors);
      const itemBlankFile = this.uriUtils.dataURItoFile('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
      return this.mediaProvider.uploadMedia({file: itemBlankFile, description: description, title: ''}, this.config.getAppItemTag());
    });
  }

  private getDescriptors(mediaResponse: MediaResponse): ItemDescriptors | null {
    const json = JSON.parse(mediaResponse.description);
    if (!('discriminator' in json && json.discriminator === "ItemDescriptors")){
      return null;
    }
    const descriptors = <ItemDescriptors>json;
    if (!(descriptors)) {
      return null;
    }
    return descriptors;
  }

  /**
   * Given a media response from the server, constructs a representation of an item.
   *
   * @param mediaResponse the media response from the server regarding a query about one item
   * @param descriptors the descriptors
   */
  private buildItem(mediaResponse: MediaResponse, descriptors: ItemDescriptors): Observable<Item>{
    const mainMediaObs = this.mediaProvider.getMedia(mediaResponse.file_id);
    const userObs = this.users.getUserInfo(mediaResponse.user_id);
    const mediaObs = Observable.zip(
      ...(descriptors.media_ids.map(media_id => this.mediaProvider.getMedia(media_id)))
    );

    return Observable.zip(userObs, mainMediaObs, mediaObs).flatMap(([user, mainMedia, medias]) => Observable.of(<Item>{
      item_id: mediaResponse.user_id,
      title: mediaResponse.title,
      descriptors: descriptors,
      mainMedia: mainMedia,
      otherMedia: medias,
      user: user,
      time_added: mediaResponse.time_added
    }));
  }


  search(data:object){
    const searchMediaPath:string = "http://media.mw.metropolia.fi/wbma/media/search";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': this.userSession.loadSessionToken() || ''
      }),
    };
    return this.http.post<MediaListingResponseEntry[]>(searchMediaPath, data, httpOptions);
  }



}
