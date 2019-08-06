import { Component, OnInit, Input } from '@angular/core';
import {  MenuController } from '@ionic/angular';
import { DataService } from '../data.service';
import {ActivatedRoute} from "@angular/router";
import {HrDataService} from '../hr-data.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MapPage} from './map/map.page';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SessionStorageService } from 'angular-web-storage';
// import { connect } from 'http2';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {  
  message:string;
  DOJ: string;
  POCName: string;
  department: string;
  empFName: string;
  empLName: string;
  workLocation: string;
  hrNumber: string;
  pocDesignation: string;
  status: string;
  empEmail: string;
  id: any;
  constructor(public router: Router, private toastCtrl: ToastController, public session: SessionStorageService, private route: ActivatedRoute, private data: DataService, private hrSerData: HrDataService, public dialog: MatDialog, public menuCtrl: MenuController, private alertController: AlertController) { 
    window.sessionStorage.clear();  
    this.route.params.subscribe( params => {
      if (params["email"]) {    
        this.getEmpdataById(params['email']);
        }
      } );
      this.data.getDataByID().subscribe(data=> {
        let hrData = data.json();       
        this.data.setEmpID(hrData[0]._id);
        this.session.set('empDataByHR', hrData[0].empDataByHR);   
        if(this.session.get('employeeDetail')){            
          this.session.set('employeeDetail', this.session.get('employeeDetail'));
        } else
        if(hrData[0].employeeDetails.empPersonalData) {
          let employees = { empPersonalData: hrData[0].employeeDetails.empPersonalData} 
          this.session.set('employeeDetail', employees);
        }
        if(this.session.get('contactDetail')){            
          this.session.set('contactDetail', this.session.get('contactDetail'));
        } else
        if(hrData[0].employeeDetails.contactDetail) {
            let contactDetailData = {contactDetail: hrData[0].employeeDetails.contactDetail }; 
            this.session.set('contactDetail', contactDetailData); 
          } 
        if(this.session.get('educationDetails')){            
          this.session.set('educationDetails', this.session.get('educationDetails'));
        } else 
        if(hrData[0].employeeDetails.educationDetail){
          let eduDetail = {educationDetail: hrData[0].employeeDetails.educationDetail};
          this.session.set('educationDetails',  eduDetail); 
        }   
        if(this.session.get('experienceDetails')){            
          this.session.set('experienceDetails', this.session.get('experienceDetails'));
        } else
        if(hrData[0].employeeDetails.experienceDetail){
          let expDetail = { experienceDetail: hrData[0].employeeDetails.experienceDetail};
          this.session.set('experienceDetails', expDetail);
        }  
        if(this.session.get('confirmationDetail')){            
          this.session.set('confirmationDetail', this.session.get('confirmationDetail'));
        } else
        if(hrData[0].employeeDetails.confirmationDetail){
          let confirmationDetailData = { confirmationDetail: hrData[0].employeeDetails.confirmationDetail             };
          this.session.set('confirmationDetail', confirmationDetailData); 
        }   
        this.id= hrData[0]._id;
        this.status = hrData[0].status;
        this.DOJ = hrData[0].empDataByHR.DOJ;
        this.empEmail = hrData[0].empDataByHR.empEmail;
        this.POCName = hrData[0].empDataByHR.buddyName;
        this.department = hrData[0].empDataByHR.department;
        this.empFName = hrData[0].empDataByHR.empFName;
        this.empLName = hrData[0].empDataByHR.empLName;
        this.workLocation = hrData[0].empDataByHR.workLocation;
        this.data.getHRDataBylocation(this.workLocation).subscribe(data =>{
          let hrEmpData = data.json();
          this.POCName = hrEmpData[0].poc;
          this.hrNumber = hrEmpData[0].poc_Ph_no;
          this.pocDesignation = hrEmpData[0].Designation
        });    
      })
  } 

  getEmpdataById(email: string) {
    this.data.getLoginData(email).subscribe(data => {
      let jsonData =  data.json();
    });
  }

  // todo:
  async noCanditateEntry(){        
      const alert = await this.alertController.create({
        header: 'Info!',
        message: 'You Have Already Submitted The Form.',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay submit Emp');  
              this.router.navigate(['/welcome/'+ this.empEmail]);  
            }
          }
        ]
      });
      await alert.present();     
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  } 

  mapLocaton() {    
    const dialogRef = this.dialog.open(MapPage, {
      width: '70%',
      data: {location: this.workLocation} //data here from search
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  nextHomePage() {
    if(this.status == 'Completed'){
      this.noCanditateEntry();
    }else {   
      this.status = 'Inprogress'; 
      if((this.hrSerData.getHrFlag() ==false) || (this.hrSerData.getHrFlag() ==undefined)) {          
          this.data.setDataStatus(this.status);
          this.data.editData(this.id).subscribe(data=>{},async err=> {        
            const toast = await this.toastCtrl.create({
              message: 'Error: Failed to Save. Please try after sometime.',
              color: 'primary',
              showCloseButton: true,
              position: 'top',
              cssClass: "className",
              duration: 3000
            });
            toast.present(); 
          }); 
        }  
      this.router.navigate(['/home']);
    }    
  }

  ngOnInit() {
    // Get User name from service
    this.data.currentMessage.subscribe(message => this.message = message);
  }
}
