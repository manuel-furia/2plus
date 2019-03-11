import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { HomePage } from '../home/home';
import { Chooser } from '@ionic-native/chooser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { stringify, unescape } from 'querystring';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})

export class UploadPage {

  file: any;
  filePath = '';
  title = '';
  description = '';
  public myBlob: Blob;
  public isImage: Boolean = false;
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
    public loadingCtrl: LoadingController,
    public mediaProvider: MediaProvider) {

    this.tag = this.navParams.get('tag');
    console.log('getting tag passed from profile page: ', this.tag);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

  handleChange($event) {
    // console.log($event.target.files);
    // get the file from $event
    this.file = $event.target.files[0];

    if (this.file != null) {
      this.hasFile = true;
    }

// call showPreview
    this.showPreview();
    if (this.file.type.includes('image')) {
      this.isImage = true;
    }
  }

  showPreview() {
    // show selected image in img
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      // console.log(reader.result);
      this.filePath = reader.result;
    };

    if (this.file.type.includes('video')) {
      this.filePath = 'http://via.placeholder.com/500X200/000?text=Video';
    } else if (this.file.type.includes('audio')) {
      this.filePath = 'http://via.placeholder.com/500X200/000?text=Audio';
    } else {
      reader.readAsDataURL(this.file);
    }

  }

  private uploadMedia() {
    const formData = this.getFormData();

    this.mediaProvider.uploadMedia(formData).subscribe(response => {

      console.log('upload media response: ', response);

      // show spinner
      //this.loading.present().catch();
      // this.setTimeOut();

      if (response.message === 'File uploaded') {

        console.log('file uploaded');

        this.uploadForm.reset();
        this.setAvatar(response);
      }
    });

  }

  private getFormData() {
//const description = `[d]${this.description}[/d]`;
    const description = this.description;
    const filters = `[f]${JSON.stringify(this.filters)}[/f]`;
    const formData = new FormData();
    formData.append('title', this.title);
    console.log('title: ', this.title);

    formData.append('description', description);
    console.log('description: ', description);

    //formData.append('filter', filters);

    formData.append('file', this.file);
    // console.log('form data append file: ', this.file);
    return formData;
  }

  private useCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((imageData) => {

        this.hasFile = true;

        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.filePath = base64Image;

        this.file = this.dataURItoBlob(base64Image);

      },
      (error) => {
        console.log(error);
      });

  }

  private dataURItoBlob(dataURI) {
    let byteString;
    let mimeString;
    let ia;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = encodeURI(dataURI.split(',')[1]);
    }
    // separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  private setAvatar(response) {
    if (this.tag === 'profile') {
      this.profileImgID = response.file_id;
      this.profileTag = {
        'file_id': this.profileImgID,
        'tag': this.tag,
      };
      this.setProfileTag(this.profileTag);
    } else {
      this.navCtrl.push(HomePage);
    }
  }

  private setProfileTag(tag) {
    this.mediaProvider.setTag(tag).subscribe(res => {
      console.log('set profile tag res: ', res);
      this.navCtrl.push(ProfilePage);
    });
  }

  private cancelUpload() {
    console.log('reset form');
    this.uploadForm.reset();
    this.filePath = '';
    this.isImage = false;
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


