import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Media } from '../../interfaces/media';
import { MediaProvider } from '../../providers/media/media';


@IonicPage()
@Component({
  selector: 'page-single-item',
  templateUrl: 'single-item.html',
})
export class SingleItemPage {
  public uploadUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  public file:Media;
  public file_id;
  public username;
  public mediaArray;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public mediaProvider:MediaProvider
              ) {
    this.file_id = this.navParams.get('file_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleItemPage');
  }

  ngOnInit(){
    this.getSingleMedia();
  }


  getSingleMedia(){
    console.log('file_id: ', this.file_id);
    this.mediaProvider.getSingleMedia(this.file_id).subscribe(singleMedia =>{

      console.log('view single media: ', singleMedia);

      this.file = singleMedia;
      console.log('media type: ', this.file.media_type);
      console.log('user id: ', this.file.user_id);
      console.log('file description: ', this.file.description);

      this.mediaProvider.getUserInfoOfSingleFile(this.file.user_id).subscribe(userInfo=>{
        //console.log('single media user info: ', userInfo);

        this.username = userInfo.username;

      });
    })
  }

  slideOpts = {
    effect: 'flip'
  };

}
