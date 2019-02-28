import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { MyItemsPage } from '../my-items/my-items';
import { UploadPage } from '../upload/upload';
import { SingleItemPage } from '../single-item/single-item';
import { Media } from '../../interfaces/media';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userAuth: UserAuthenticationProvider,
              public mediaProvider:MediaProvider) {
  }

  public filePath = 'http://media.mw.metropolia.fi/wbma/uploads/';
  avatarID;

  ngOnInit(){
    this.getAvatar();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
   // this.getAvatar();
  }

  getAvatar(){
    console.log('get avatar...');
    this.mediaProvider.getMediaByTag('profile').subscribe(files => {
      console.log('files with tag profile', files);
      for(let i=0; i<files.length; i++){
        console.log('profile img user_id: ', files[i].user_id);
        if(files[i].user_id != this.userAuth.user.user_id)
        delete files[i];
      }
      console.log('this user_id: ', this.userAuth.user.user_id);

      console.log('my profile imgs?: ', files);
      if(files.length==0) this.avatarID=null;
     this.avatarID = files[files.length-1].file_id;
     console.log('avatarID: ', this.avatarID);
    })
  }

  setAvatar() {
    this.navCtrl.push(UploadPage,{
      tag: 'profile'
    });
    console.log('set avatar :)');
  }


  logout() {
    localStorage.clear();
    this.userAuth.hasLoggedIn = false;
    this.navCtrl.parent.select(0);
  }

  goToMyItemsPage() {
    this.navCtrl.push(MyItemsPage);
  }

  deleteAccount() {
    this.mediaProvider.deleteUser(this.userAuth.user.user_id).subscribe(res=>{
      this.mediaProvider.presentToast(res.message);
      localStorage.clear();
    })
  }

}
