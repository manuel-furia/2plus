import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginRegisterPage } from './login-register';

@NgModule({
  declarations: [
    LoginRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginRegisterPage),
  ],
})
export class LoginRegisterPageModule {}
