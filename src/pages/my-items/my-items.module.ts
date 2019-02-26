import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyItemsPage } from './my-items';

@NgModule({
  declarations: [
    MyItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyItemsPage),
  ],
})
export class MyItemsPageModule {}
