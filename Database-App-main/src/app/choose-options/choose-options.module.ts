import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseOptionsPageRoutingModule } from './choose-options-routing.module';

import { ChooseOptionsPage } from './choose-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseOptionsPageRoutingModule
  ],
  declarations: [ChooseOptionsPage]
})
export class ChooseOptionsPageModule {}
