import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {DirectivesModule} from '../directives/directives.module';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import {  FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    FileUploadModule,
    MatSelectModule,
    DirectivesModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.cubeGrid,
      backdropBorderRadius: '3px',
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
   }),
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
