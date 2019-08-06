import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HrDataService} from '../../hr-data.service';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

export interface DialogData {
  searchDOJ : string; 
  searchLocation: string;
  DOJFrom: Date;
  DOJTo: Date;
  searchResult : any;
}

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.page.html',
  styleUrls: ['./advance-search.page.scss'],
})
export class AdvanceSearchPage implements OnInit {
  searchDOJ : string; 
  searchLocation: string = 'all';
  DOJFrom: Date;
  DOJTo: Date;
  bothDateFlag: boolean =false;

  ngOnInit() {
  }

  constructor( private alertController: AlertController,
    private hrData: HrDataService, 
    private toastCtrl: ToastController,
    public dialogRef: MatDialogRef<AdvanceSearchPage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async search() {
    if(this.searchLocation == null || this.searchLocation == undefined) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter mandatory field: Location',
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        duration: 3000
      });
      toast.present();
    }   
    // console.log(this.DOJFrom, 'this.DOJTo', this.DOJTo, ' !(this.DOJFrom)', !(this.DOJFrom));
    // console.log('!(this.DOJFrom) && (this.DOJTo)', !(this.DOJFrom) && (this.DOJTo))
    if(((this.DOJFrom !== undefined) && (this.DOJTo == undefined)) || (!(this.DOJFrom) && (this.DOJTo))){
      this.bothDateFlag = true;
    } else {
    this.hrData.advanceSearch(this.searchLocation || null , this.searchDOJ ? moment(this.searchDOJ).format('YYYY-MM-DD') : null,  
    this.DOJFrom ? moment(this.DOJFrom).format('YYYY-MM-DD') : null , this.DOJTo ? moment(this.DOJTo).format('YYYY-MM-DD') : null).subscribe(
       searchdata => {    
        console.log('search Data' + searchdata) ;
        this.data.searchResult = searchdata.json();
        this.dialogRef.close(this.data.searchResult);
      },
      async error => {        
        console.log('oops', error); 
          const toast = await this.toastCtrl.create({
            message: 'Error: Search failed. Please try after sometime.',
            color: 'primary',
            showCloseButton: true,
            position: 'top',
            cssClass: "className",
            duration: 2000
          });
          toast.present(); 
      }
    );
    }
  }
}
