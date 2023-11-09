import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResultsPage } from './results.page';
import { ResultListComponent } from './result-list/result-list.component';
import { ResultListItemComponent } from '../results/result-list-item/result-list-item.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { SharedModule } from '../shared/module/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ResultsPage
  },
  {
    path: ':teamId',
    component: ResultsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    ResultsPage,
    ResultListComponent,
    // ResultListItemComponent,
    // ConfirmPopupComponent
  ],
  // entryComponents: [ConfirmPopupComponent]
})
export class ResultsPageModule { }
