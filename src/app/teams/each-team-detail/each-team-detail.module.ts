import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EachTeamDetailPage } from './each-team-detail.page';
import { TeamSportCategoryComponent } from '../team-sport-category/team-sport-category.component';
import { TeamDivisionComponent } from '../team-division/team-division.component';

const routes: Routes = [
  {
    path: '',
    component: EachTeamDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EachTeamDetailPage, TeamSportCategoryComponent, TeamDivisionComponent]
})
export class EachTeamDetailPageModule { }
