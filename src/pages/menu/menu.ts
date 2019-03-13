import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UploadPage } from '../upload/upload';
import { SearchPage } from '../search/search';
import { MyItemsPage } from '../my-items/my-items';
import { LoginRegisterPage } from '../login-register/login-register';
import { ProfilePage } from '../profile/profile';
import { LoginProvider } from '../../providers/login/login';
import { StorageProvider } from "../../providers/storage/storage";

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(public navCtrl: NavController,
              public userSession: StorageProvider,
              public userAuth: LoginProvider) {
  }

  goToHomePage() {
    this.navCtrl.push(HomePage);
  }

  goToUploadPage() {
    this.navCtrl.push(UploadPage);

  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);

  }

  goToMyItemsPage() {
    this.navCtrl.push(MyItemsPage);

  }

  goToLoginPage() {
    this.navCtrl.push(LoginRegisterPage);

  }

  goToProfilePage() {
    this.navCtrl.push(ProfilePage);

  }

  logout() {
    this.userSession.deleteSession();
    this.navCtrl.parent.select(0);
  }
}
