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

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})


export class UploadPage {

  constructor(private chooser:Chooser,
              private camera:Camera,
              public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public mediaProvider: MediaProvider) {  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

  file: any;
  filePath = '';
  title = '';
  description = '';
  public myBlob: Blob;
  public isImage:Boolean = false;
  public hasFile:Boolean = false;
  @ViewChild('uploadForm') uploadForm: any;

  filters = {
    brightness: 100,
    contrast: 100,
    warmth: 0,
    saturation: 100,
  };



  public chooseFile(){
    this.chooser.getFile("image/*, video/!*, audio/!*")
    .then(file => {
      if(file){
        console.log(file ? file.name : 'canceled');
        console.log(file.dataURI);
        console.log(file.mediaType);
        //console.log(file.uri);
        this.hasFile = true;
        this.showPreview(file);

      }else {
        alert("please choose a file to upload");
      }
    })
    .catch((error: any) => console.error(error));

  }

  showPreview(file) {

    this.file = new Blob(
      [file.data], {
        type: file.mediaType
      });

    const reader = new FileReader();
    reader.addEventListener("loadend", function() {
      // reader.result contains the contents of blob as a typed array
      reader.result;
    });
    reader.readAsArrayBuffer(this.file);
    console.log('myfile: ', this.file);

    if (file.mediaType.includes('video')) {
      this.filePath = 'http://via.placeholder.com/500X200/000?text=Video';
    } else if (file.mediaType.includes('audio')) {
      this.filePath = 'http://via.placeholder.com/500X200/000?text=Audio';
    } else {
      this.filePath = file.dataURI;
      // if(file.mediaType.includes('image')){}
      this.isImage = true;
    }

  }

  public uploadMedia(){
    //const description = `[d]${this.description}[/d]`;
    const description = this.description;
    const filters = `[f]${JSON.stringify(this.filters)}[/f]`;
    const formData = new FormData();
    formData.append('title', this.title);
    console.log('title: ', this.title);

    formData.append('description', description);
    console.log('description: ', description);

    //formData.append('filter', filters);

    //formData.append('file', this.file);
    formData.append('file', this.file);
    console.log('form data append file: ', this.file);

    this.mediaProvider.uploadMedia( formData).subscribe(response => {

      console.log('upload media response: ', response);

      // show spinner
      this.loading.present().catch();

      // setTimeout 2. secs
      setTimeout(() => {
        this.navCtrl.pop().catch();
        // hide spinner
        this.loading.dismiss().catch();
      }, 2000);

      if(response.message ==="file uploaded"){
        // this.navCtrl.pop();
        console.log('file uploaded');
        this.mediaProvider.presentToast(response.message);
       // this.uploadForm.reset();
       // this.navCtrl.popTo(HomePage);
        this.navCtrl.push(HomePage);
      }

    });

  }



  useCamera() {
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


  dataURItoBlob(dataURI) {
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
    return new Blob([ia], {type:mimeString});
  }


  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });


  cancelUpload() {
    console.log('reset form');
    this.uploadForm.reset();
    this.filePath='';
    this.isImage=false;
  }

}
