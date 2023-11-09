import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResultByCategoryPage } from './result-by-category.page';
import { ResultCategoryListComponent } from '../result-by-category/result-category-list/result-category-list.component';
import { ResultCategoryListItemComponent } from './result-category-list-item/result-category-list-item.component'
// import { ResultListComponent } from '../result-list/result-list.component';
// import { ResultListItemComponent } from '../result-list-item/result-list-item.component';

const routes: Routes = [
  {
    path: '',
    component: ResultByCategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResultByCategoryPage, ResultCategoryListComponent, ResultCategoryListItemComponent]
})
export class ResultByCategoryPageModule { }
