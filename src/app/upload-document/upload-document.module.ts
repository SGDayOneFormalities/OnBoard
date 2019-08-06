import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UploadDocumentPage } from './upload-document.page';

import {  FileUploadModule } from 'ng2-file-upload';
const routes: Routes = [
  {
    path: '',
    component: UploadDocumentPage
  }
];

@NgModule({
  imports: [
    
    FileUploadModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UploadDocumentPage]
})
export class UploadDocumentPageModule {}
