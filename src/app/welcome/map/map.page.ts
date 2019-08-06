import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HrDataService} from '../../hr-data.service';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

export interface DialogData {
  location: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor(
    private hrData: HrDataService, 
    private toastCtrl: ToastController,
    public dialogRef: MatDialogRef<MapPage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  
  ngOnInit() {
    if(this.data.location== 'Chennai'){ }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  async search() {
  }

}
