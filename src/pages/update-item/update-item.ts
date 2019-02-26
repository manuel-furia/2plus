import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { MyItemsPage } from '../my-items/my-items';

@IonicPage()
@Component({
  selector: 'page-update-item',
  templateUrl: 'update-item.html',
})
export class UpdateItemPage {


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public mediaProvider:MediaProvider) {
    this.file_id = this.navParams.get('file_id');
  }

  title = '';
  description = '';
  data: {};
  file_id;

  @ViewChild('modifyForm') modifyForm: any;


  updateItemInfo(){
    const description = `[d]${this.description}[/d]`;

    console.log('title: ', this.title);
    console.log('description: ', description);
    console.log('file_id: ', this.file_id);

    this.data ={
      "title": this.title,
      "description": description
    };

    this.mediaProvider.updateItemInfo(this.file_id, this.data).subscribe(response => {

      console.log('upload media response', response);

      if(response.message ==="File info updated"){
        console.log('File info updated');
        this.mediaProvider.presentToast(response.message);
        this.navCtrl.push(MyItemsPage);
      }

    });

  }

  cancelModify() {
    console.log('reset form');
    this.modifyForm.reset();
  }

}
