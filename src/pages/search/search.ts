import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Media } from '../../interfaces/media';
import { MediaProvider } from '../../providers/media/media';
import { SingleItemPage } from '../single-item/single-item';
import { Item } from "../../interfaces/item";
import { ItemsProvider } from "../../providers/items/items";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  location: string;
  searchTerm: string;
  priceOrder: string;
  @ViewChild('searchForm') searchForm: any;
  showSearchForm:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public itemsProvider:ItemsProvider) {
  }

  public uploadUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  public itemsArray: Item[];

  ionViewDidLoad() {
  }


  //search with title only, without filter terms yet
  search(){
    let data = {"title": this.searchTerm, "description": this.searchTerm, location: this.location, ascPrice: this.priceOrder === "ascend"};
    console.log("AA");
    this.itemsProvider.search(data).subscribe(items => {
      console.log("AAA");
      console.log(items);
      this.itemsArray = items;
      this.showSearchForm = false;
    });

  }



  viewSingleMedia(file_id: number) {
    this.navCtrl.push(SingleItemPage,{
      file_id: file_id
    });
    this.showSearchForm = false;
  }


  cancelSearch() {
    this.searchForm.reset();
  }
}
