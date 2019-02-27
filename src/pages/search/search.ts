import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Media } from '../../interfaces/media';
import { MediaProvider } from '../../providers/media/media';
import { SingleItemPage } from '../single-item/single-item';

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
    console.log('ionViewDidLoad SearchPage');
  }
  searchTerm;

//search with title only, without filter terms yet
  search(){
    console.log('search term: ', this.searchTerm);
    let data = {"title": this.searchTerm};
    console.log('search term: ', data);

    this.mediaArray = this.mediaProvider.search(data);
      this.showSearchForm = false;

    console.log('search mediaArray: ', this.mediaArray);
  }



  viewSingleMedia(file_id: number) {
    console.log('view single search item: ', file_id);
    this.navCtrl.push(SingleItemPage,{
      file_id: file_id
    });
    this.showSearchForm = false;
  }


  cancelSearch() {
    this.searchForm.reset();
  }
}
