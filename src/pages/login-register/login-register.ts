import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginProvider } from "../../providers/login/login";
import { StorageProvider } from "../../providers/storage/storage";
import { DialogProvider } from "../../providers/dialog/dialog";

@IonicPage()
@Component({
  selector: 'page-login-register',
  templateUrl: 'login-register.html',
})
/**
 * Logic model of the page used to login or register.
 */
export class LoginRegisterPage {

  user = {
    username: '',
    password: '',
    email: '',
    fullname: ''
  };

  confirm_password: string = '';

  constructor(
    public navCtrl: NavController,
    public userAuth: LoginProvider,
    public dialog: DialogProvider,
    public storage: StorageProvider
  ) {
  }

  showRegisterForm = false;

  /**
   * Toggle between showing the register form or hiding it.
   */
  toggleLoginFormOrRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  /**
   * Send a login request to the server and store the resulting session if successful.
   */
  login() {
    this.userAuth.login(this.user.username, this.user.password).subscribe(loginRes => {
      if (loginRes && 'token' in loginRes && 'user' in loginRes) {
        this.storage.storeSession(loginRes.token, loginRes.user);
        this.dialog.presentToast(loginRes.message);
        this.goToHomePage();
      } else {
        this.dialog.presentToast(loginRes.message);
      }
    });
  }

  /**
   * Show an alert to the user if the username already exists.
   */
  checkUsername() {
    this.userAuth.checkUsername(this.user.username).subscribe(res => {
      if (res) {
        this.dialog.presentToast(`User ${this.user.username} already exists.`);
      }
    });
  }

  /**
   * Alert the user if the password and confirmation do not match
   */
  verifyPassword() {
    if (this.user.password !== this.confirm_password) {
      this.dialog.presentToast('passwords do not match!');
    }
  }

  /**
   * Register a new user.
   */
  register() {
    this.userAuth.register(this.user.username, this.user.password, this.user.email, this.user.fullname).subscribe(registerRes => {
      if (registerRes['message'] == 'User created successfully') {
        this.dialog.presentToast(registerRes['message']);
        this.login();
      }
    });
  }

  /**
   * Leave the login page and navigate to the home page.
   */
  goToHomePage() {
    this.navCtrl.push(HomePage);
  }
}
