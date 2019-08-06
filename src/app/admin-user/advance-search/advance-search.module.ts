import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { AdvanceSearchPage } from './advance-search.page';

const routes: Routes = [
  {
    path: '',
    component: AdvanceSearchPage
  }
];

@NgModule({
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class AdvanceSearchPageModule {}
