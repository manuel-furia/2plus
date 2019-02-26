import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { Media } from '../../interfaces/media';
import { Observable } from 'rxjs';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { User } from '../../interfaces/user';
import { LoginRegisterPage } from '../login-register/login-register';
import { SingleItemPage } from '../single-item/single-item';
import { MyItemsPage } from '../my-items/my-items';
import { UploadPage } from '../upload/upload';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mediaStoragePath = 'http://media.mw.metropolia.fi/wbma/uploads/';
  mediaArray:Observable<Media[]>;


  constructor(public navCtrl: NavController,
              public mediaProvider:MediaProvider,
              public userAuth:UserAuthenticationProvider) { }

  ngOnInit() {
    this.getAllMedia();
  }

//TODO: GET ALL MEDIA BY TAGS('2PLUS')
  getAllMedia(){
    console.log("homepage: gett all media...");
    this.mediaArray = this.mediaProvider.getAllMedia();
  }

//click on view button to view single media
  viewBiggerImg(file_id: number) {
    this.navCtrl.push(SingleItemPage,{
      file_id: file_id
    })
  }

  //header navigation
  goToMyItemsPage() {
    this.navCtrl.push(MyItemsPage);
  }

  goToUploadPage() {
    this.navCtrl.push(UploadPage);
  }

  goToSearchPage() {
    this.navCtrl.push(SearchPage);
  }

  goToLoginPage() {
    this.navCtrl.push(LoginRegisterPage);
  }
}
