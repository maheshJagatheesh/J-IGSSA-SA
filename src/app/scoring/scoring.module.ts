import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScoringPage } from './scoring.page';
import { ScoreDetailsComponent } from './score-details/score-details.component';
import { ScoreListComponent } from './score-list/score-list.component';
import { ScoreComponent } from '../fixtures/score/score.component';
import { ConfirmModalComponent } from '../fixtures/confirm-modal/confirm-modal.component';
import { SharedModule } from '../shared/module/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ScoringPage
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
  declarations: [ScoringPage, ScoreDetailsComponent, ScoreListComponent],
  // entryComponents: [ConfirmModalComponent]
})
export class ScoringPageModule { }
