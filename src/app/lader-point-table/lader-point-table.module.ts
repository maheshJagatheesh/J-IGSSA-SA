import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LaderPointTablePage } from './lader-point-table.page';

const routes: Routes = [
  {
    path: '',
    component: LaderPointTablePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LaderPointTablePage]
})
export class LaderPointTablePageModule {}
