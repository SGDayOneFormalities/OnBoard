import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import {DirectivesModule} from '../directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { ConfirmationdetailPage } from './confirmationdetail.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmationdetailPage
  }
];

@NgModule({
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    DirectivesModule,
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
  declarations: [ConfirmationdetailPage]
})
export class ConfirmationdetailPageModule {}
