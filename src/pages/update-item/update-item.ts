import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { MyItemsPage } from '../my-items/my-items';
import { ItemsProvider } from "../../providers/items/items";
import { Observable } from "rxjs";
import { DialogProvider } from "../../providers/dialog/dialog";

@IonicPage()
@Component({
  selector: 'page-update-item',
  templateUrl: 'update-item.html',
})
export class UpdateItemPage {


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private itemsProvider:ItemsProvider,
              private dialog: DialogProvider) {
    this.file_id = this.navParams.get('file_id');
  }

  title: string;
  price: number;
  location: string;
  description: string;
  file_id;

  @ViewChild('modifyForm') modifyForm: any;


  updateItemInfo(){
    const oldDescriptor = this.itemsProvider.getItem(this.file_id).flatMap(item => {
      const oldDescriptors = item !== null ? item.descriptors : {};
      const description = this.description;

      const data = {
        "title": this.title,
        "description": description
      };

      return this.itemsProvider.updateItemInfo(this.file_id, data);
    }).subscribe(response => {

      if (response.message === "File info updated"){
        this.dialog.presentToast(response.message);
        this.navCtrl.push(MyItemsPage);
      }

    });
  }

  cancelModify() {
    this.modifyForm.reset();
  }

}
