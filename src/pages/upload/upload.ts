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

  filedata = '';
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

    this.myBlob = new Blob(
      [file.data], {
        type: file.mediaType
      });

    const reader = new FileReader();
    reader.addEventListener("loadend", function() {
      // reader.result contains the contents of blob as a typed array
      reader.result;
    });
    reader.readAsArrayBuffer(this.myBlob);
    console.log('myfile: ', this.myBlob);

    if (file.mediaType.includes('video')) {
      this.filedata = 'http://via.placeholder.com/500X200/000?text=Video';
    } else if (file.mediaType.includes('audio')) {
      this.filedata = 'http://via.placeholder.com/500X200/000?text=Audio';
    } else {
      this.filedata = file.dataURI;
      // if(file.mediaType.includes('image')){}
      this.isImage = true;
    }

  }

  public uploadMedia(){
    const description = `[d]${this.description}[/d]`;
    const filters = `[f]${JSON.stringify(this.filters)}[/f]`;

    // show spinner
    this.loading.present().catch();

    const formData = new FormData();
    formData.append('title', this.title);
    console.log('title: ', this.title);

    formData.append('description', description + filters);
    console.log('description: ', description);

    //formData.append('file', this.file);
    formData.append('file', this.myBlob);
    console.log('form data append, my blob: ', this.myBlob);

    this.mediaProvider.uploadMedia( formData).subscribe(response => {

      console.log('upload media response', response);

      // setTimeout 2. secs
      setTimeout(() => {
        this.navCtrl.pop().catch();
        // hide spinner
        this.loading.dismiss().catch();
      }, 2000);

      if(response.message ==="file uploaded"){
        // this.navCtrl.pop();
        console.log('file uploaded');
        //this.mediaProvider.presentToast(response.message);
       // this.uploadForm.reset();
        this.navCtrl.popTo(HomePage);
      }

    });

  }


  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });



  useCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      if(imageData){

        console.log('image data: ', imageData);
        this.filedata = 'data:image/jpeg;base64,' + imageData;
        this.hasFile = true;
        this.dataURItoBlob(imageData);
      }

    }, (err) => {
      // Handle error
      console.log("Camera issue: " + err);
    });
  }

  //TODO: UPLOAD PHOTO TAKEN BY CAMERA
  //this is not working yet...
  dataURItoBlob(dataURI) {
    var byteString, mimestring;

    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
      byteString = atob(dataURI.split(',')[1])
    } else {
      byteString = decodeURI(dataURI.split(',')[1])
    }

    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let content = [];
    for (let i = 0; i < byteString.length; i++) {
      content[i] = byteString.charCodeAt(i)
    }

    this.myBlob = new Blob([new Uint8Array(content)], {type: mimestring});
    console.log('dataURI to blob, my blob: ', this.myBlob);
    return this.myBlob;
  }



  cancelUpload() {
    console.log('reset form');
    this.uploadForm.reset();
    this.filedata='';
    this.isImage=false;
  }

}
