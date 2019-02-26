import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { MyItemsPage } from '../my-items/my-items';


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


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
