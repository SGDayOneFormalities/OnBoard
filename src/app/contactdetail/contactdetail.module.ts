import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactdetailPage } from './contactdetail.page';

import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {DirectivesModule} from '../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: ContactdetailPage
  }
];

@NgModule({
  imports: [   
    MatSelectModule, 
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactdetailPage]
})
export class ContactdetailPageModule {}
