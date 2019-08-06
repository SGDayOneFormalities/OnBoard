import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { IonicModule } from '@ionic/angular';

import { AddEmployeePage } from './add-employee.page';

import { MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {DirectivesModule} from '../directives/directives.module';
const routes: Routes = [
  {
    path: '',
    component: AddEmployeePage
  }
];

@NgModule({
  imports: [
    DirectivesModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.cubeGrid,
      backdropBorderRadius: '3px',
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
   }),
    RouterModule.forChild(routes)
  ],
  declarations: [AddEmployeePage]
})
export class AddEmployeePageModule {}
