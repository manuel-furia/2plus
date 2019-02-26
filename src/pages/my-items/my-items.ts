import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Media } from '../../interfaces/media';
import { MediaProvider } from '../../providers/media/media';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { SingleItemPage } from '../single-item/single-item';
import { UpdateItemPage } from '../update-item/update-item';

@IonicPage()
@Component({
  selector: 'page-my-items',
  templateUrl: 'my-items.html',
})
export class MyItemsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userAuth:UserAuthenticationProvider,
              public mediaProvider:MediaProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyItemsPage');
  }

  public uploadUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  public mediaArray: Observable<Media[]>;



  ngOnInit() {
    this.getAllMediaOfSingleUser();
  }

  getAllMediaOfSingleUser() {
    this.userAuth.checkToken().subscribe(user =>{
      console.log('user: ', user);

      this.mediaArray = this.mediaProvider.getAllMediaOfCurrentUser(user.user_id);

      console.log('current user mediaArray: ', this.mediaArray);
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
    this.mediaProvider.confirmationAlert('Do you really want to delete the file?').then(confirm => {
      if (confirm) {

        this.mediaProvider.deleteFile(file_id).subscribe(deleteRes=>{
          console.log('delete file response: ', deleteRes);
          this.mediaProvider.presentToast(deleteRes.message);
          this.navCtrl.push(MyItemsPage);
        })

      } else {
        console.log('Canceled');
      }
    })
  }

}
