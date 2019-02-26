import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateItemPage } from './update-item';

@NgModule({
  declarations: [
    UpdateItemPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateItemPage),
  ],
})
export class UpdateItemPageModule {}
