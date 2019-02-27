import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  publishDate: Date;
  location: string;
  priceOrder: any;
  searchTerm: string;
  @ViewChild('searchForm') searchForm: any;
  showSearchForm: true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  search() {

  }

  cancelSearch() {
    this.searchForm.reset();
  }
}
