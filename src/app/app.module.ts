import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginRegisterPage } from '../pages/login-register/login-register';
import { ProfilePage } from '../pages/profile/profile';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from '../pipes/pipes.module';
import { MediaProvider } from '../providers/media/media';
import { UserAuthenticationProvider } from '../providers/user-authentication/user-authentication';
import { UploadPage } from '../pages/upload/upload';
import { SearchPage } from '../pages/search/search';
import { MyItemsPage } from '../pages/my-items/my-items';
import { Chooser } from '@ionic-native/chooser';
import { Camera } from '@ionic-native/camera';
import { SingleItemPage } from '../pages/single-item/single-item';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { UpdateItemPage } from '../pages/update-item/update-item';
import { MenuPage } from '../pages/menu/menu';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginRegisterPage,
    ProfilePage,
    UploadPage,
    SingleItemPage,
    UpdateItemPage,
    SearchPage,
    MyItemsPage,
    MenuPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    PipesModule,
    PinchZoomModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginRegisterPage,
    ProfilePage,
    UploadPage,
    SingleItemPage,
    SearchPage,
    MyItemsPage,
    UpdateItemPage,
    MenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MediaProvider,
    UserAuthenticationProvider,
    Chooser,
    Camera,
    ]
})
export class AppModule {}
