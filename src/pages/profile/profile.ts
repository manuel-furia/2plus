import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { MyItemsPage } from '../my-items/my-items';
import { UploadPage } from '../upload/upload';
import { SingleItemPage } from '../single-item/single-item';
import { Media } from '../../interfaces/media';
import { User } from '../../interfaces/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userAuth: UserAuthenticationProvider,
    public mediaProvider: MediaProvider) {
  }

  public filePath = 'http://media.mw.metropolia.fi/wbma/uploads/';
  avatarID;
  profileImages:Media[] =[];
  user: User = {};
  showUpdateForm: boolean = false;
  @ViewChild('updateUserInfoForm') updateUserInfoForm: any;

  ngOnInit() {
    this.getAvatar();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    // this.getAvatar();
  }

  getAvatar() {
    console.log('get avatar...');
    this.mediaProvider.getMediaByTag('profile').subscribe(files => {
     // console.log('files with tag profile', files);
      if (files.length == 0) {
        this.avatarID = undefined;
      } else{
        files.forEach(file=>{
          if(file.user_id == this.userAuth.user.user_id){
            this.profileImages.push(file);
          }
        });
          console.log('after compare', this.profileImages.length);
          console.log('this user_id: ', this.userAuth.user.user_id);
          console.log('my profile imgs?: ', this.profileImages);


        if (this.profileImages.length == 0) {
          this.avatarID = undefined;
        } else{
          this.avatarID = this.profileImages[this.profileImages.length - 1].file_id;
          console.log('avatarID: ', this.avatarID);
        }
      }

    });
  }

  setAvatar() {
    this.navCtrl.push(UploadPage, {
      tag: 'profile',
    });
    console.log('set avatar :)');
  }

  logout() {
    localStorage.clear();
    this.userAuth.hasLoggedIn = false;
    this.navCtrl.parent.select(0);
  }

  goToMyItemsPage() {
    this.navCtrl.push(MyItemsPage);
  }

  deleteAccount() {
    this.mediaProvider.deleteUser(this.userAuth.user.user_id).subscribe(res => {
      this.mediaProvider.presentToast(res.message);
      localStorage.clear();
    });
  }

  updateUserInfo() {
    let newData={};

    if(this.user.username != null){
       newData["username"]= this.user.username;
      this.userAuth.user.username = this.user.username;
    }
    if(this.user.email != undefined){
      newData['email']=this.user.email;
      this.userAuth.user.email = this.user.email;
    }
    if(this.user.password != undefined){
      newData['password']= this.user.password;
      this.userAuth.user.password = this.user.password;
    }

    console.log('new user data: ', newData);

    this.mediaProvider.updateUserInfo(newData).subscribe(res => {
      console.log('update user data res: ', res.message);
      this.mediaProvider.presentToast(res.message);

      this.updateUserInfoForm.reset();
      this.showUpdateForm = false;
    });

  }

  checkUsername() {
    if(this.user.username != null){
      this.userAuth.checkUsername(this.user.username).subscribe(res => {
        console.log('check username availability res: ', res);
        if (res['available'] !== true) {
          alert('username is taken!');
        }
      });
    }

  }

  showUserInfoForm() {
    this.showUpdateForm = true;
  }
}
