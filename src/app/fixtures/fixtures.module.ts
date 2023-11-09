import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FixturesPage } from './fixtures.page';
import { MatchDetailsComponent } from '../fixtures/match-details/match-details.component';
import { SharedModule } from '../shared/module/shared/shared.module';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchRoundComponent} from './match-round/match-round.component'

  import { AgmCoreModule } from '@agm/core';

import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { environment } from 'src/environments/environment';
import { ScoreComponent } from './score/score.component';
import { ScoreCardComponent } from './score/score-card/score-card.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MatchTileComponent } from './match-tile/match-tile.component';

const routes: Routes = [
  {
    path: '',
    component: FixturesPage
  },
  {
    path: ':teamId',
    component: FixturesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey
    }),
    AgmSnazzyInfoWindowModule,
    SharedModule
  ],
  declarations: [FixturesPage, MatchDetailsComponent, MatchListComponent, ScoreCardComponent, MatchRoundComponent, MatchTileComponent],
  // entryComponents: [ConfirmModalComponent]
})
export class FixturesPageModule { }
