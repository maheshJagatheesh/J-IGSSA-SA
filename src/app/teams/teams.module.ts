import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TeamsPage } from './teams.page';
import { TeamTileComponent } from './team-tile/team-tile.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { SharedModule } from '../shared/module/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TeamsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [TeamsPage, TeamTileComponent, FavouriteComponent]
})
export class TeamsPageModule { }
