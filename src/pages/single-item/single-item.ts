import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Item } from "../../interfaces/item";
import { ItemsProvider } from "../../providers/items/items";
import { Media } from "../../interfaces/media";


@IonicPage()
@Component({
  selector: 'page-single-item',
  templateUrl: 'single-item.html',
})
export class SingleItemPage {
  public uploadUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  public item: Item;
  public file_id;
  public username;
  mediaArray: Media[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public itemsProvider:ItemsProvider
              ) {
    this.file_id = this.navParams.get('file_id');
  }

  ionViewDidLoad() {
  }

  ngOnInit(){
    this.getItem();
  }


  getItem(){
    this.itemsProvider.getItem(this.file_id).subscribe(item => {
      if (item !== null) {
        this.item = item;
        this.username = item.user.username;
        this.mediaArray = item.otherMedia;
      }
    });
  }
}
