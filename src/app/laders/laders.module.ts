import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LadersPage } from './laders.page';
import { GameTypeComponent } from '../laders/game-type/game-type.component';
import { FavouriteComponent } from '../teams/favourite/favourite.component';
import { SharedModule } from '../shared/module/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LadersPage
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
  declarations: [LadersPage, GameTypeComponent]
})
export class LadersPageModule { }
