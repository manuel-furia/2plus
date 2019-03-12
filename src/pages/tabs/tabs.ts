import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { HomePage } from '../home/home';
import { LoginRegisterPage } from '../login-register/login-register';
import { ProfilePage } from '../profile/profile';
import { LoginProvider } from '../../providers/login/login';
import { User } from '../../interfaces/user';
import { UploadPage } from '../upload/upload';
import { MyItemsPage } from '../my-items/my-items';
import { SearchPage } from '../search/search';
import { MenuPage } from '../menu/menu';
import { StorageProvider } from "../../providers/storage/storage";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  LoginRegisterPage: any;
  HomePage: any;
  UploadPage;
  MyItemsPage;
  SearchPage;
  ProfilePage: any;
  MenuPage;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userStorage:StorageProvider,
              public mediaProvider:MediaProvider)
  {
    this.LoginRegisterPage = LoginRegisterPage;
    this.HomePage = HomePage;
    this.ProfilePage = ProfilePage;
    this.UploadPage = UploadPage;
    this.MyItemsPage = MyItemsPage;
    this.SearchPage = SearchPage;
    this.MenuPage = MenuPage;
  }


  ngOnInit() {
  }

  ionViewDidLoad() {
  }


}
