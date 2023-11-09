import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreComponent } from 'src/app/fixtures/score/score.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompetitionFilterComponent } from '../../components/competition-filter/competition-filter.component';
import { CompetitionFilterIconComponent } from '../../components/competition-filter-icon/competition-filter-icon.component'
import { CompetitionFilterService } from '../../components/competition-filter/competition-filter.service';
import { FilterLabelComponent } from '../../components/competition-filter/filter-label/filter-label.component';
import { CommonNotificationComponent } from '../../components/common-notification/common-notification.component';
import { CommonScoringComponent } from '../../components/common-scoring/common-scoring.component';
import { ResultListItemComponent } from '../../../results/result-list-item/result-list-item.component'
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/results/confirm-popup/confirm-popup.component';
import { CommonFilterComponent } from '../../components/common-filter/common-filter.component';
import { ConfirmModalComponent } from 'src/app/fixtures/confirm-modal/confirm-modal.component';
import { CommonInjuryComponent } from '../../components/common-injury/common-injury.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    ScoreComponent,
    CompetitionFilterComponent,
    CompetitionFilterIconComponent,
    FilterLabelComponent,
    CommonNotificationComponent, 
    CommonScoringComponent,
    ResultListItemComponent,
    ConfirmPopupComponent,
    CommonFilterComponent,
    ConfirmModalComponent,
    CommonInjuryComponent
  ],
  entryComponents: [
    ScoreComponent,
    CompetitionFilterComponent,
    CompetitionFilterIconComponent,
    ConfirmPopupComponent,
    ConfirmModalComponent
  ],
  providers: [
    CompetitionFilterService
  ],
  exports: [
    CompetitionFilterIconComponent, 
    CommonNotificationComponent, 
    CommonScoringComponent, 
    ResultListItemComponent, 
    ConfirmPopupComponent, 
    CommonFilterComponent, 
    CommonInjuryComponent
  ]
})
export class SharedModule { }
