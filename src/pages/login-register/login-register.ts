import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../interfaces/user';
import { UserAuthenticationProvider } from '../../providers/user-authentication/user-authentication';
import { MediaProvider } from '../../providers/media/media';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login-register',
  templateUrl: 'login-register.html',
})
export class LoginRegisterPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userAuth: UserAuthenticationProvider,
    public mediaProvider: MediaProvider,
  ) {
  }

  showRegisterForm = false;
  user: User = {};
  confirm_password: any;
  public token: string;

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginRegisterPage');
  }

  //show login form by default,
  // if user has no account and clicks on create new account, show register form
  showLoginFormOrRegisterForm() {
    this.showRegisterForm = this.showRegisterForm == false;
  }

  //user login

  //TODO: SHOW LOGIN ERROR MESSAGE
  login() {
    this.userAuth.login(this.user).subscribe(loginRes => {
      console.log('login res: ', loginRes);

      if (loginRes) {

        localStorage.setItem('token', loginRes.token);
        this.token = localStorage.getItem('token');
        console.log('login token', this.token);

        this.userAuth.hasLoggedIn = true;
        this.mediaProvider.presentToast(loginRes.message);
        this.navCtrl.push(HomePage);
        //this.navCtrl.setRoot(TabsPage);
      }
    });

  }

//check if a username already exists
  checkUsername() {
    this.userAuth.checkUsername(this.user.username).subscribe(res => {
      console.log('check username availability res: ', res);
      if (res['available'] !== true) {
        alert('username is taken!');
      }
    });
  }

  verifyPassword() {
    if (this.user.password !== this.confirm_password) {
      alert('passwords do not match!');
    }
  }

  register() {
    this.userAuth.register(this.user).subscribe(resgisterRes => {
      console.log('resgister res: ', resgisterRes);
      if (resgisterRes['message'] == 'User created successfully') {
        this.mediaProvider.presentToast(resgisterRes['message']);
        this.login();
        // this.navCtrl.setRoot(TabsPage);
      }
    });
  }

  goToHomePage() {
    this.navCtrl.push(HomePage);
  }
}
