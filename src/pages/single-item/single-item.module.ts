import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleItemPage } from './single-item';

@NgModule({
  declarations: [
    SingleItemPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleItemPage),
  ],
})
export class SingleItemPageModule {}
