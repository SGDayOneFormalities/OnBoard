import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {DirectivesModule} from '../directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { ExperiencedetailPage } from './experiencedetail.page';

const routes: Routes = [
  {
    path: '',
    component: ExperiencedetailPage
  }
];

@NgModule({
  imports: [
    MatDatepickerModule,
    MatInputModule,
    DirectivesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExperiencedetailPage]
})
export class ExperiencedetailPageModule {}
