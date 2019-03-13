import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { MyItemsPage } from '../my-items/my-items';
import { UploadPage } from '../upload/upload';
import { Media } from '../../interfaces/media';
import { LoginProvider } from "../../providers/login/login";
import { StorageProvider } from "../../providers/storage/storage";
import { ConfigProvider } from "../../providers/config/config";
import { UserProvider } from "../../providers/users/user";
import { DialogProvider } from "../../providers/dialog/dialog";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public config: ConfigProvider,
    public userAuth: LoginProvider,
    public mediaProvider: MediaProvider,
    public userSession: StorageProvider,
    private users: UserProvider,
    private dialog: DialogProvider) {
  }

  public filePath = 'http://media.mw.metropolia.fi/wbma/uploads/';
  avatarID;
  user = {username: '', full_name: '', email: '', password: ''};
  showUpdateForm: boolean = false;
  @ViewChild('updateUserInfoForm') updateUserInfoForm: any;

  ngOnInit() {
    this.getAvatar();
    this.getUserInfo();
  }

  ionViewDidLoad() {
  }

  getUserInfo(){
    const user = this.userSession.loadSessionUser();
    if (user === null) return;
    this.users.getUserInfo(user.user_id).subscribe(info => {
      this.user.username = user.username;
      this.user.email = user.email;
      this.user.full_name = user.full_name || '';
    });
  }

  getAvatar() {
    const user = this.userSession.loadSessionUser();
    if (user === null) return;
    this.mediaProvider.getMediaByTag(this.config.getAvatarTag(user.user_id)).subscribe(files => {
      if (files.length < 1) {
        this.avatarID = undefined;
      } else{
        const lastAvatar = files.sort((a, b) => {
          const timeA = new Date(a.time_added);
          const timeB = new Date(b.time_added);
          return timeA > timeB ? -1 : timeA < timeB ? 1 : 0;
        })[0];
        this.avatarID = lastAvatar.media_id;
      }

    });
  }

  setAvatar() {
    const user = this.userSession.loadSessionUser();
    if (user !== null) {
      this.navCtrl.push(UploadPage, {
        tag: this.config.getAvatarTag(user.user_id),
      });
    }
  }

  logout() {
    this.userSession.deleteSession();
    this.navCtrl.parent.select(0);
  }

  goToMyItemsPage() {
    this.navCtrl.push(MyItemsPage);
  }

  deleteAccount() {
    const user = this.userSession.loadSessionUser();
    if (user !== null) {
      this.users.deleteUser(user.user_id).subscribe(res => {
        this.dialog.presentToast(res.message);
        this.userSession.deleteSession();
      });
    }
  }

  updateUserInfo() {
    let newData={};
    if(this.user.username != null){
      newData["username"]= this.user.username;
    }
    if(this.user.email != null){
      newData['email']=this.user.email;
    }
    if(this.user.password != null){
      newData['password']= this.user.password;
    }

    console.log('new user data: ', newData);

    this.users.updateUserInfo(newData).subscribe(res => {
      console.log('update user data res: ', res.message);
      this.dialog.presentToast(res.message);

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
