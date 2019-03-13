import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { stringify, unescape } from 'querystring';
import { ProfilePage } from '../profile/profile';
import { UriUtils } from "../../providers/utils/uriUtils";
import { ItemsProvider } from "../../providers/items/items";
import { ItemUploadInfo } from "../../interfaces/itemUploadInfo";
import { GeoLocation } from "../../interfaces/geoLocation";
import { GeoProvider } from "../../providers/geo/geo";
import { DialogProvider } from "../../providers/dialog/dialog";
import { HomePage } from "../home/home";

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})

export class UploadPage {
    cities: string[];
  price: number;
  city: string;
  category: string;
  contact: string;
  files: FileInfo[] = [this.getDefaultFileEntry()];
  title = '';
  description = '';
  public hasFile: Boolean = false;
  @ViewChild('uploadForm') uploadForm: any;

  profileTag: {};
  tag: string = '';
  profileImgID: number;

  filters = {
    brightness: 100,
    contrast: 100,
    warmth: 0,
    saturation: 100,
  };

  constructor(
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform:Platform,
    public loadingCtrl: LoadingController,
    public itemsProvider: ItemsProvider,
    public mediaProvider: MediaProvider,
    public uriUtils: UriUtils,
    public geo: GeoProvider,
    public dialog: DialogProvider) {
    this.tag = this.navParams.get('tag');
    console.log('getting tag passed from profile page: ', this.tag);
  }

  private getDefaultFileEntry(){
    return {file: undefined, filePath: '', isImage: false,
      filters: {
        brightness: 100,
        contrast: 100,
        warmth: 0,
        saturation: 100,
      }
    }
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
    console.log('platform cordova: ', this.platform.is("cordova"));
    console.log('platform: ', this.platform)

  }

  handleChange($event, fileIndex: number) {
    // console.log($event.target.files);
    // get the file from $event
    this.files[fileIndex].file = $event.target.files[0];

    if (this.files[fileIndex].file !== null) {
      this.hasFile = true;
    }

    this.showPreview(fileIndex);
    const file = this.files[fileIndex].file;

    if (file !== undefined && file.type.includes('image')) {
      this.files[fileIndex].isImage = true;
    }
  }

  addMoreFiles(){
    this.files.push(this.getDefaultFileEntry());
  }

  showPreview(fileIndex: number) {
    // show selected image in img
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      this.files[fileIndex].filePath = reader.result;
    };

    const file = this.files[fileIndex].file;

    if (file !== undefined) {
      if (file.type.includes('video')) {
        this.files[fileIndex].filePath = 'http://via.placeholder.com/500X200/000?text=Video';
      } else if (file.type.includes('audio')) {
        this.files[fileIndex].filePath = 'http://via.placeholder.com/500X200/000?text=Audio';
      } else {
        reader.readAsDataURL(file);
      }
    }
  }

  verifyLocation(){
    if(this.geo.knownCities().map(city => city.toLocaleLowerCase()).indexOf(this.city.toLocaleLowerCase()) < 0){
      this.dialog.presentToast('We could not find this city, town or municipality in Finland.');
    }
  }

  private uploadItem(){

  }

  private uploadMedia() {
    const data = this.getItemData();

    this.itemsProvider.uploadItem(data).subscribe(response => {

      console.log('upload media response: ', response);

      if (response.message === 'File uploaded') {
        console.log('file uploaded');

        this.uploadForm.reset();
        this.navCtrl.push(HomePage);
      }
    });

  }


  private getItemData() {
    const description = this.description;
    const filters = this.filters;
    const title = this.title;
    const files = this.files;
    return <ItemUploadInfo>{
      title: this.title,
      description: this.description,
      price: this.price,
      contact: this.contact || '',
      location: this.city,
      category: this.category,
      medias: this.files.map(file => ({file: file.file, filter: file.filters}))};
  }

  private useCamera(fileIndex: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((imageData) => {

        this.hasFile = true;

        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.files[fileIndex].filePath = base64Image;

        this.files[fileIndex].file = this.uriUtils.dataURItoFile(base64Image);

      },
      (error) => {
        console.log(error);
      });

  }

  private setAvatar(response) {
    this.profileImgID = response.file_id;
    this.profileTag = {
      'file_id': this.profileImgID,
      'tag': this.tag,
    };
    this.setProfileTag(this.profileTag);
  }

  private setProfileTag(tag) {
    this.mediaProvider.setTag(tag).subscribe(res => {
      console.log('set profile tag res: ', res);
    });
    this.navCtrl.push(ProfilePage);
  }

  private cancelUpload() {
    console.log('reset form');
    this.uploadForm.reset();
    this.files = [this.getDefaultFileEntry()];
    this.title = '';
    this.description = '';
  }

  private loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  private setTimeOut() {
// setTimeout 2. secs
    setTimeout(() => {
      this.navCtrl.pop().catch();
      // hide spinner
      this.loading.dismiss().catch();
    }, 2000);
  }

}

interface FileInfo {
  file?: File,
  filePath?: String,
  isImage?: boolean,
  filters?: {
    brightness: number,
    contrast: number,
    warmth: number,
    saturation: number,
  };
}
