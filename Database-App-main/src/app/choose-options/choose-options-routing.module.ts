import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseOptionsPage } from './choose-options.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseOptionsPageRoutingModule {}
