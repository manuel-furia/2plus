import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Media } from '../../interfaces/media';
import { MediaProvider } from '../../providers/media/media';
import { SingleItemPage } from '../single-item/single-item';
import { Item } from "../../interfaces/item";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  publishDate: Date;
  location: string;
  priceOrder: any;
  @ViewChild('searchForm') searchForm: any;
  showSearchForm:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider:MediaProvider) {
  }

  public uploadUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  public mediaArray: Observable<Media[]>;

  ionViewDidLoad() {
  }
  searchTerm;

  //search with title only, without filter terms yet
  search(){
    let data = {"title": this.searchTerm};

    this.mediaArray = this.mediaProvider.search(data);
      this.showSearchForm = false;
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
