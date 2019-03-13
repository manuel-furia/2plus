import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { LoginRegisterPage } from '../login-register/login-register';
import { SingleItemPage } from '../single-item/single-item';
import { MyItemsPage } from '../my-items/my-items';
import { UploadPage } from '../upload/upload';
import { SearchPage } from '../search/search';
import { ItemsProvider } from "../../providers/items/items";
import { Item } from "../../interfaces/item";
import { StorageProvider } from "../../providers/storage/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mediaStoragePath = 'http://media.mw.metropolia.fi/wbma/uploads/';
  itemArray: Item[] = [];


  constructor(public navCtrl: NavController,
              public itemsProvider:ItemsProvider,
              private userSession: StorageProvider) { }

  ngOnInit() {
    this.getAllMedia();
  }

  getAllMedia(){
    this.itemsProvider.getRelevantItems().subscribe(items => {
      this.itemArray = items;
    });
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
