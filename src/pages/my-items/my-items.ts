import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Media } from '../../interfaces/media';
import { MediaProvider } from '../../providers/media/media';
import { SingleItemPage } from '../single-item/single-item';
import { UpdateItemPage } from '../update-item/update-item';
import { StorageProvider } from "../../providers/storage/storage";
import { DialogProvider } from "../../providers/dialog/dialog";
import { Item } from "../../interfaces/item";
import { ItemsProvider } from "../../providers/items/items";

@IonicPage()
@Component({
  selector: 'page-my-items',
  templateUrl: 'my-items.html',
})
export class MyItemsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userStorage:StorageProvider,
              public itemsProvider:ItemsProvider,
              public mediaProvider:MediaProvider,
              public dialog: DialogProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyItemsPage');
  }

  public uploadUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  public itemArray: Item[];



  ngOnInit() {
    this.getAllMediaOfSingleUser();
  }

  getAllMediaOfSingleUser() {
    const user = this.userStorage.loadSessionUser();
    this.itemsProvider.getItemsOfCurrentUser().subscribe(items => {
      console.log(items);
        this.itemArray = items;
    });
  }

  viewSingleMedia(file_id: number) {
    this.navCtrl.push(SingleItemPage,{
      file_id: file_id
    })
  }

  goToUpdatePage(file_id: number) {
    this.navCtrl.push(UpdateItemPage,{
      file_id: file_id
    })
  }


  deleteFile(file_id: number) {
    this.dialog.confirmationAlert('Do you really want to delete this element?').subscribe(confirm => {
      if (confirm) {
        this.mediaProvider.deleteFile(file_id).subscribe(deleteRes => {
          this.mediaProvider.presentToast(deleteRes.message);
          this.navCtrl.push(MyItemsPage);
        })
      }
    });
  }

}
