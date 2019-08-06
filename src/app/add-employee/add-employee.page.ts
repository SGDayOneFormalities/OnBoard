import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { SessionStorageService } from 'angular-web-storage';
import * as moment from 'moment';
import { DataService } from '../data.service';
import { ToastController } from '@ionic/angular';
import {HrDataService} from '../hr-data.service';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { MatDatepicker, MatFormField } from '@angular/material';

@Component({
  selector: 'app-edit',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {
  public loading = false;
  empdata : any={};
  crossFocus : boolean;
  id : string;
  status : string;
  toastMessage: string;
  toastMessage1: string;
  toastMessage2: string;
  toastMessage3: string;
  toastMessage4: string;
  selectedHrData:any;
  empFName : string;
  empMName : string;
  empLName : string;  
  DOJ: Date;
  empEmailId : string;
  designation :  string;
  department : string;
  buddyName : string;
  workLocation : string;
  addFlag: boolean = true;  
  mailText:string = "";
  hrReviewStatus: string;
  focusInput: boolean = false;
  @ViewChild(MatDatepicker) pickerDOJ: MatDatepicker<Date>;

  constructor(private location: Location, private alertController: AlertController, public router: Router, private hrData: HrDataService, public session: SessionStorageService, private postdata: DataService, private toastCtrl: ToastController) {
    
    this.status = 'New';
    this.hrData.empDataSelected.subscribe(selecteddata => { 
      this.selectedHrData = JSON.parse(JSON.stringify(selecteddata));   
      if(this.selectedHrData) {
        if(this.selectedHrData.empDataByHR == undefined) {
          this.reloadAdmin();
        }else {
        this.addFlag= false;
        this.id = this.selectedHrData._id; 
        this.hrReviewStatus = this.selectedHrData.hrReviewStatus;
        this.empFName = this.selectedHrData.empDataByHR.empFName;
        this.empLName = this.selectedHrData.empDataByHR.empLName;
        this.empMName = this.selectedHrData.empDataByHR.empMName;
        this.DOJ = this.selectedHrData.empDataByHR.DOJ;
        //.replace('s1H','/').replace('aD3p','+') .replace('Eq2l','=')
        let enrpted = this.selectedHrData.empDataByHR.empEmail.trim().toString().split('sA1H').join('/').split('aD3p').join('+').split('Eq2l').join('=');
        this.empEmailId  = CryptoJS.AES.decrypt(enrpted.trim(),this.empFName.trim()).toString(CryptoJS.enc.Utf8);  
        this.designation  = this.selectedHrData.empDataByHR.designation;
        this.department = this.selectedHrData.empDataByHR.department;
        this.buddyName  = this.selectedHrData.empDataByHR.buddyName;
        this.workLocation = this.selectedHrData.empDataByHR.workLocation;
        }
      }      
    });
  }

  ngOnInit() {}
       
  openCalendar(pickerDOJ: MatDatepicker<Date>) {
    if(this.focusInput == false) {pickerDOJ.close(); this.focusInput = true}
    
    else { pickerDOJ.open();
      this.focusInput=false;}
  }
  closePicker(pickerDOJ: MatDatepicker<Date>){
    pickerDOJ.close();
    this.DOJ=null;
  }
    
  async mailMe(){
    let pattern  = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/i;
    if ((this.empEmailId=='' || this.empEmailId==undefined || pattern.test(this.empEmailId)==false)) { 
      const toast = await this.toastCtrl.create({
        message: 'Please fill Email ID.',
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        cssClass: "className",
        duration: 2000
      });
      toast.present(); 
    }else { 
      this.mailText = "mailto:"+ this.empEmailId+"?subject=Details required&body=http%3A%2F%2F10.2.108.66%3A4200%2Fwelcome/"+ this.selectedHrData.employeeDetails.contactDetail.emailId+"%0D%0AClick on the link and enter your personal details%0D%0ARagards"
      window.location.href = this.mailText;
    }
  }  

  async addEmployee(empFName, empMName, empLName,  DOJ, empEmailId, designation, department, buddyName, workLocation) {    
    this.loading = true;
    this.status = 'New';
    let date = moment(new Date()).format('DD-MM-YYYY_HH.mm.ss.SSS');
    let DOJFormate = moment(DOJ).format('YYYY-MM-DD');
    this.id= empFName+empLName+'_'+date;
    
    let pattern  = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/i;
    if(empFName=='' || empFName==undefined || empLName=='' || empLName == undefined || DOJ == null 
    || empEmailId == '' || empEmailId == undefined ||  pattern.test(empEmailId)==false || workLocation == null || workLocation == undefined) {  
      
      this.toastMessage = '';
      this.toastMessage1 = '';
      this.toastMessage2 = ''; 
      this.toastMessage3 = ''; 
      this.toastMessage4 = '';
      if (empFName=='' || empFName==undefined) {
        this.toastMessage = "\n- First Name";
      }
      if (empLName=='' || empLName == undefined) {
        this.toastMessage1 = "\n- Last Name";
      }
      if ((empEmailId=='' || empEmailId==undefined ) || (pattern.test(empEmailId) == false)) {
        this.toastMessage2 = "\n- Email Id";
      } 
      if (DOJ==null || DOJ == undefined) {
        this.toastMessage3 =  "\n- Date of Joining";
      } 
      if(workLocation == null || workLocation == undefined){
        this.toastMessage4 =  "\n- Location";
      }
      const toast = await this.toastCtrl.create({
        message: 'Please fill mandatory fields:'+ this.toastMessage + this.toastMessage1 + this.toastMessage2 + this.toastMessage3 + this.toastMessage4,
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        cssClass: "className",
        duration: 2000
      });
      toast.present();    
      this.loading = false;   
    } else {      
      let emailId = CryptoJS.AES.encrypt(this.empEmailId.trim(), this.empFName.trim()).toString().split('/').join('sA1H').split('+').join('aD3p').split('=').join('Eq2l');
      console.log('emailId', emailId)
      this.empdata = {      
        "empFName": empFName ? empFName : '',
        "empMName": empMName || '',
        "empLName": empLName || '',
        "empEmail": emailId || '',
        "DOJ": DOJFormate || null,
        "department": department || null,
        "designation": designation || '',
        "buddyName": buddyName || '',
        "workLocation": workLocation || null
      };
      this.session.set('empDataByHR', this.empdata);  
      this.postdata.setDataStatus(this.status);    
      
      this.postdata.setEmployeedata(this.status, this.id);
      this.hrData.emailSMTP(this.empEmailId, emailId, empFName, empMName, empLName, workLocation, DOJFormate).subscribe(  
        async () => {           
          const toast = await this.toastCtrl.create({
            message: 'Email is sent to the candidate.',
            color: 'primary',
            showCloseButton: true,
            position: 'top',
            cssClass: "className",
            duration: 10000
          });
          toast.present().then(() => {              
            this.loading = false;            
            this.router.navigate(['/admin-user']).then(()=> {
              location.reload();
            });
            window.sessionStorage.clear(); 
          }); 
        },
        async error => {
          console.log('oops', error);
          const toast = await this.toastCtrl.create({
            message: 'Error: Details not added or Email is not sent.',
            color: 'primary',
            showCloseButton: true,
            position: 'top',
            cssClass: "className",
            duration: 2000
          });
          toast.present(); 
          this.loading = false; 
        }
      );  
      // ,{
      //   queryParams: {refresh: '/admin-user'}
    }
  }

  reloadAdmin(){    
    this.router.navigate(['/admin-user']).then(()=> location.reload());
    window.sessionStorage.clear(); 
  }
  
  async editEmployee(empFName, empMName, empLName,  DOJ, empEmailId, designation, department, buddyName, workLocation) {  
    this.loading = true;
    let empLoginData= this.selectedHrData;  
    this.session.set('employeeDetails', empLoginData.employeeDetails);
    if(empLoginData.employeeDetails.empPersonalData) {
      let employees = { empPersonalData: empLoginData.employeeDetails.empPersonalData} 
      this.session.set('employeeDetail', employees);
    }   
    if(empLoginData.employeeDetails.contactDetail) {
      let contactDetailData = {contactDetail: empLoginData.employeeDetails.contactDetail };  
      this.session.set('contactDetail', contactDetailData); 
    }  
    if(empLoginData.employeeDetails.educationDetail){
      let eduDetail = {educationDetail: empLoginData.employeeDetails.educationDetail};
      this.session.set('educationDetails',  eduDetail); 
    }   
    if(empLoginData.employeeDetails.experienceDetail){
      let expDetail = { experienceDetail: empLoginData.employeeDetails.experienceDetail};
      this.session.set('experienceDetails', expDetail);
    }  
    if(empLoginData.employeeDetails.confirmationDetail){
      let confirmationDetailData = { confirmationDetail: empLoginData.employeeDetails.confirmationDetail             };
      this.session.set('confirmationDetail', confirmationDetailData); 
    }  
    this.status = this.selectedHrData.status;
    let date = moment(new Date()).format('DD-MM-YYYY_HH.mm.ss.SSS');
    let DOJFormate = moment(DOJ).format('YYYY-MM-DD');
    //GEt id existing    
    let pattern  = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/i;
    if(empFName=='' || empFName==undefined || empLName=='' || empLName == undefined || DOJ == null || 
    empEmailId == '' || empEmailId == undefined ||  pattern.test(empEmailId)==false || workLocation == null || workLocation == undefined) {  
      this.toastMessage = '';
      this.toastMessage1 = '';
      this.toastMessage2 = '';        
      this.toastMessage3 = ''; 
      this.toastMessage4 = '';
      if (empFName=='' || empFName==undefined) {
        this.toastMessage = "\n- First Name";
      }
      if (empLName=='' || empLName == undefined) {
        this.toastMessage1 = "\n- Last Name";
      }
      if ((empEmailId=='' || empEmailId==undefined ) || (pattern.test(empEmailId) == false)) {
        this.toastMessage2 = "\n- Email Id";
      } 
      if (DOJ==null) {
        this.toastMessage3 =  "\n- Date of Joining";
      } 
      if(workLocation == null || workLocation == undefined){
        this.toastMessage4 =  "\n- Location";
      }
      const toast = await this.toastCtrl.create({
        message: 'Please fill mandatory fields:'+ this.toastMessage + this.toastMessage1 + this.toastMessage2 + this.toastMessage3 + this.toastMessage4,
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        cssClass: "className",
        duration: 4000
      });
      toast.present();     
      this.loading = false;   
    } else {       
      //.split('dog').join('')
      let encrptMail = CryptoJS.AES.encrypt(this.empEmailId.trim(), this.empFName.trim()).toString();
      console.log('CryptoJS.AES.encrypt', encrptMail);
      let emailId = encrptMail.split('/').join('sA1H').split('+').join('aD3p').split('=').join('Eq2l');
      console.log('emailId', emailId);
      this.empdata = {      
        "empFName": empFName ? empFName : '',
        "empMName": empMName || '',
        "empLName": empLName || '',
        "empEmail": emailId || '',
        "DOJ": DOJFormate || null,
        "department": department || null,
        "designation": designation || '',
        "buddyName": buddyName || '',
        "workLocation": workLocation || null
      };
      this.session.set('empDataByHR', this.empdata);
      this.postdata.setDataStatus(this.status);    
      this.postdata.setHrReviewStatus(this.hrReviewStatus); 
      this.loading = false; 
        const toast = await this.toastCtrl.create({
          message: 'Details is Sucessfully Edited and Email is sent to the candidate.',
          color: 'primary',
          showCloseButton: true,
          position: 'top',
          cssClass: "className",
          duration: 4000
        });
        toast.present().then(() => {            
          this.router.navigate(['/admin-user']).then(()=> {
            location.reload();
          });
          window.sessionStorage.clear(); 
        })
      this.postdata.editData(this.id).subscribe(async () =>{
        this.hrData.emailSMTP(this.empEmailId, emailId, empFName, empMName, empLName, workLocation, DOJFormate).subscribe(
          async () => {            
            this.loading = false; 
            const toast = await this.toastCtrl.create({
              message: 'Details is Sucessfully Edited and Email is sent to the candidate.',
              color: 'primary',
              showCloseButton: true,
              position: 'top',
              cssClass: "className",
              duration: 4000
            });
            toast.present().then(() => {            
              this.router.navigate(['/admin-user']).then(()=> {
                location.reload();
              });
              window.sessionStorage.clear(); 
            }); 
          },
          async error => {
            console.log('oops', error);
            const toast = await this.toastCtrl.create({
              message: 'Error: Failed to send Email.',
              color: 'primary',
              showCloseButton: true,
              position: 'top',
              cssClass: "className",
              duration: 4000
            });
            toast.present(); 
            this.loading = false; 
          }
        ); 
      },
      async error => {
        console.log('oops', error);
        const alert = await this.alertController.create({
          header: 'Error!',
          message: 'Saving of Details Failed. Please try after sometime.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {}
            }
          ]
        });
        await alert.present(); 
      });  
         //   "empName": "Balaji",
    // "empLoc": "Chennai",
    // "empDOJ": "26-06-2019"
      
    }    
  }
  
  backAdminPage(){
    this.hrData.changeAuthUser('authorizedUser');
    this.router.navigate(['/admin-user']);
  }

  clearPage(){}
}

