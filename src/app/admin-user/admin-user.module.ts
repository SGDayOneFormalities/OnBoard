import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderModule } from 'ngx-order-pipe';
import { IonicModule } from '@ionic/angular';
import { PipeComponent } from '../pipe/pipe.component'; 
import { AdminUserPage } from './admin-user.page';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import {MatDatepickerModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatFormFieldModule, MatInputModule, MatCardModule} from '@angular/material';
import {MatTooltipModule} from '@angular/material/tooltip';
const routes: Routes = [
  {
    path: '',
    component: AdminUserPage
  }
];

@NgModule({
  imports: [
    MatTooltipModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    OrderModule,
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
  declarations: [AdminUserPage, PipeComponent],
  entryComponents: [],
})
export class AdminUserPageModule {}
