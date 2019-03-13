import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { Media } from '../../interfaces/media';
import { User } from '../../interfaces/user';
import { MediaResponse } from "../../interfaces/mediaResponse";
import { Observable } from "rxjs";
import { StorageProvider } from "../storage/storage";
import { NotificationResponse } from "../../interfaces/notificationResponse";
import { MediaListingResponseEntry } from "../../interfaces/mediaListingResponseEntry";
import { MediaUpdateRequest } from "../../interfaces/mediaUpdateRequest";
import { UploadMediaResponse } from "../../interfaces/uploadMediaResponse";
import { UploadMediaRequest } from "../../interfaces/uploadMediaRequest";
import { MediaDescriptors } from "../../interfaces/mediaDescriptors";


@Injectable()
export class MediaProvider {

  constructor(public http: HttpClient,
              public alertController: AlertController,
              public toastCtrl: ToastController,
              public userSession: StorageProvider) { }


  /**
   * Query the server for detailed info of a media (includes info about user and id)
   * @param file_id the id of the file representing the media
   */
  public queryDetailedMediaInfo(file_id: number): Observable<MediaResponse>{
    const mediaURL:string = "http://media.mw.metropolia.fi/wbma/media/"+file_id;
    // console.log( "medial url : " + mediaURL );
    return  this.http.get<MediaResponse>(mediaURL);
  }

  /**
   * Get detailed information (including thumbnails) of a single media
   * @param file_id the id of the file representing the media
   */
  public getMedia(file_id: number): Observable<Media>{
    const mediaResponse = this.queryDetailedMediaInfo(file_id);
    return mediaResponse.flatMap(response => Observable.of(this.mediaResponseToMedia(response)));
  }

  /**
   * Get detailed information (including thumbnails) of a single media
   * @param file_id the id of the file representing the media
   */
  public getMediaByTag(tag: string): Observable<Media[]>{
    const mediaListings: Observable<MediaListingResponseEntry[]> = this.getMediaListingsByTag(tag);
    return mediaListings.flatMap(listings => Observable.zip(...(listings.map(listing => this.getMedia(listing.file_id)))));
  }

  /**
   * Get all the medias with a specific tag, with listing information.
   * @param tag the tag
   */
  public getMediaListingsByTag(tag: string): Observable<MediaListingResponseEntry[]>{
    const mediaPath:string = 'http://media.mw.metropolia.fi/wbma/tags/'+tag;

    return this.http.get<MediaListingResponseEntry[]>(mediaPath);
  }

  /**
   * Get all the media listings created by a specific user
   */
  public getAllMediaListingsOfCurrentUser(): Observable<MediaListingResponseEntry[]>{
    const user = this.userSession.loadSessionUser();
    if (user === null) throw Observable.throw('User not logged in.');
    const allMediaOfSingleUserPath:string = "http://media.mw.metropolia.fi/wbma/media/user/"+user.user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.userSession.loadSessionToken() || ''
      })
    };
    console.log(httpOptions);
    return this.http.get<MediaListingResponseEntry[]>(allMediaOfSingleUserPath, httpOptions);
  }

  private mediaResponseToMedia(response: MediaResponse): Media {
    const getThumbnail = () => {
      if (response.thumbnails && response.thumbnails != null && Object.keys(response.thumbnails).length > 0){
        const firstKey = Object.keys(response.thumbnails)[0];
        const firstThumbnail = response.thumbnails[firstKey];
        return firstThumbnail;
      } else {
        return null;
      }
    };
    return <Media>{
        media_id: response.file_id,
        filename: response.filename,
        media_type: response.media_type,
        mime_type: response.mime_type,
        time_added: response.time_added,
        thumbnail: getThumbnail(),
        user_id: response.user_id
      };

  }



  //when user clicks on view button, show user info of that media file
  getUserInfoOfSingleFile(user_id){
    const userInfoPath:string = "http://media.mw.metropolia.fi/wbma/users/"+user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': this.userSession.loadSessionToken() || '',
      })
    };
    return this.http.get<User>(userInfoPath, httpOptions);

  }


//TODO: when user upload a file, attach a tag 2plus?
  /**
   * Upload a media file to the server.
   * @param data the data describing the media file
   */
  public uploadMedia(data: UploadMediaRequest, tag: string = ''): Observable<UploadMediaResponse> {
    const uploadPath:string = "http://media.mw.metropolia.fi/wbma/media";
    let accessToken = this.userSession.loadSessionToken() || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': accessToken
      }),
    };
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('file', data.file, data.file.name);
    if (tag !== '') {
      return this.http.post<UploadMediaResponse>(uploadPath, formData, httpOptions).flatMap(response => {
          this.setTag({ file_id: response.file_id, tag: tag }).subscribe((tagresponse) => {});
          return Observable.of(response);
        }
      );
    } else {
      return this.http.post<UploadMediaResponse>(uploadPath, formData, httpOptions);
    }
  }

  setTag(data: SetTagRequest){
    const setTagPath = 'http://media.mw.metropolia.fi/wbma/tags';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': this.userSession.loadSessionToken() || ''
      }),
    };
    return this.http.post<NotificationResponse>(setTagPath, data, httpOptions);
  }

  deleteFile(file_id): Observable<NotificationResponse>{
    const deleteFilePath:string = "http://media.mw.metropolia.fi/wbma/media/"+file_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.userSession.loadSessionToken() || ''
      }),
    };
    return this.http.delete<NotificationResponse>(deleteFilePath, httpOptions);
  }

  deleteUser(userID){
    const deleteUserPath:string = "http://media.mw.metropolia.fi/wbma/users/"+userID;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.userSession.loadSessionToken() || ''
      }),
    };
    return this.http.delete<NotificationResponse>(deleteUserPath, httpOptions);
  }

  search(data:object){
    const searchMediaPath:string = "http://media.mw.metropolia.fi/wbma/media/search";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': this.userSession.loadSessionToken() || ''
      }),
    };
    return this.http.post<Media[]>(searchMediaPath, data, httpOptions);
  }

  updateUserInfo(data){
    const updateUserDataPath:string = "http://media.mw.metropolia.fi/wbma/users/";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': this.userSession.loadSessionToken() || ''
      }),
    };
    return this.http.put<NotificationResponse>(updateUserDataPath, data, httpOptions);
  }


  //show confirmation alert before deleting a file
  confirmationAlert(message: string): Promise<boolean> {
    let promise = new Promise<boolean>(resolve => {
      let alert = this.alertController.create({
        title: 'Confirmation',
        message: message,
        enableBackdropDismiss: false,
        buttons: [ {
          text: 'No',
          handler: () => resolve(false)
        }, {
          text: 'Yes',
          handler: () => resolve(true)
        } ]
      });

      alert.present();
    });

    return promise;
  }

  //show toast message
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}

interface SetTagRequest{
  file_id: number,
  tag: string
}

