import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {DirectivesModule} from '../directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { EducationdetailPage } from './educationdetail.page';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
const routes: Routes = [
  {
    path: '',
    component: EducationdetailPage
  }
];

@NgModule({
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DirectivesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EducationdetailPage]
})
export class EducationdetailPageModule {}
