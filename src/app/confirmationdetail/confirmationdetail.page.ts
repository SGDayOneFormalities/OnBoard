import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { AlertController } from '@ionic/angular';
import {HrDataService} from '../hr-data.service';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-confirmationdetail',
  templateUrl: './confirmationdetail.page.html',
  styleUrls: ['./confirmationdetail.page.scss'],
})
export class ConfirmationdetailPage implements OnInit {
  isReadonly: boolean =  false;
  empname: string;
  submitDate: Date;
  maxDate: Date = new Date();
  employeename:string;
  canditateName: string;
  confirmationDetailData: any;
  referralName : string;
  referralCode: string;
  canditateEmpCode: any;
  submitLocation: string;
  apiStatus : string;
  selectedHrData: any;
  isHrFlag: boolean;
  status : string;
  id: string;
  saved: boolean = false;  
  focus: boolean;  
  workLocation: string;
  DOJ: string;
  empFName: string;
  empMName: string;
  empLName: string;
  encryptEmailId: string;
  decrptedEmpEmailId: string;
  public loading = false;
  resendComment :string;
  propagationFlag: boolean = false;
  isIpad :  boolean = false;

  constructor(public plt: Platform, public router: Router, private hrData: HrDataService, public session: SessionStorageService, private empdata: DataService, private alertController: AlertController) {
    if (this.plt.is('ipad')) {
      this.isIpad = true;
        console.log("running in a browser on ipad!");
    } else {
      this.isIpad = false;
    }
  }

  ngOnInit() {
    this.hrData.isHrFlag.subscribe(flag => {
      console.log('hr flag', flag);
      this.isHrFlag = flag
    });
    this.empdata.currentMessage.subscribe(message => this.employeename = message);
    this.empname = this.employeename ;
    this.canditateName = this.employeename;
    if((this.hrData.getHrFlag() == undefined) || (this.hrData.getHrFlag() ==false)){
      this.empdata.getDataByID().subscribe(data=> {
        console.log('data',data);   
        let value= data.json();
        this.selectedHrData = value[0];
        if(this.session.get('confirmationDetail') && (this.propagationFlag == false)){
          console.log('in session contactDetail');
          // if(this.propagationFlag == false) { 
            this.assignData(this.session.get('confirmationDetail'));
          // }
        }else 
        if((value[0])  && (this.propagationFlag == false)) {
          // if() {
            console.log('elseSelected', value[0]);
          this.assignData(value[0]);
          // }
        }
        // this.id = value[0]._id;  
        
        // console.log(value[0].empDataByHR, 'value[0])',value[0]);           
        // this.session.set('empDataByHR', value[0].empDataByHR);   
        // this.workLocation= value[0].empDataByHR.workLocation;
        // this.DOJ=value[0].empDataByHR.DOJ;        
        // this.empFName= value[0].empDataByHR.empFName;
        // this.empLName = value[0].empDataByHR.empLName;
        // this.empMName = value[0].empDataByHR.empMName;  
        // this.canditateName = value[0].empDataByHR.empFName + ' '+value[0].empDataByHR.empMName +' '+value[0].empDataByHR.empLName; 
        // this.encryptEmailId= value[0].empDataByHR.empEmail;
        // console.log('this.encryptEmailId', this.encryptEmailId);
        // let enrpted = value[0].empDataByHR.empEmail.trim().toString().split('sA1H').join('/').split('aD3p').join('+').split('Eq2l').join('=');
        // this.decrptedEmpEmailId  = CryptoJS.AES.decrypt(enrpted.trim(),this.empFName.trim()).toString(CryptoJS.enc.Utf8);      
        // let confirmData = value[0].employeeDetails.confirmationDetail;        
        // this.resendComment = this.selectedHrData.hrComments;
        // if(value[0].employeeDetails.confirmationDetail){
        //   this.referralName = confirmData.referralName;
        //   this.referralCode = confirmData.referralCode, 
        //   this.submitDate = confirmData.submitDate, 
        //   this.submitLocation = confirmData.submitLocation, 
        //   this.canditateName = value[0].empDataByHR.empFName+ ' '+value[0].empDataByHR.empMName +' '+value[0].empDataByHR.empLName; 
        //   this.canditateEmpCode = confirmData.canditateEmpCode;
        // }
      })
    }
    if(this.hrData.getHrFlag()){
      this.hrData.changeIsHr(true);
      this.hrData.empDataSelected.subscribe(selecteddata => { 
        this.selectedHrData = JSON.parse(JSON.stringify(selecteddata));  
        if((this.session.get('confirmationDetail')) && (this.propagationFlag == false)){
          console.log('in session contactDetail', this.session.get('confirmationDetail'));
          // if(this.propagationFlag == false) { 
            this.assignData(this.session.get('confirmationDetail'));
          // }
        }else 
        if((this.selectedHrData) && (this.propagationFlag == false)) {
          // if() {
            console.log('elseSelected');
            this.assignData(this.selectedHrData);
          // }
        }
        // if(this.selectedHrData){
          
        // }
      });
      this.isReadonly = this.hrData.getReadFlag();
    }
    if(this.isReadonly == false){
      this.submitDate = new Date();
    }
  }

  assignData(selectedHrData){
    console.log('selectedHrData', selectedHrData);
    this.propagationFlag = true;
    // this.session.set('empDataByHR', selectedHrData.empDataByHR); 
    this.id = this.selectedHrData._id;   
    this.status = this.selectedHrData.status;        
    this.empFName= this.selectedHrData.empDataByHR.empFName;
    this.empLName = this.selectedHrData.empDataByHR.empLName;
    this.empMName = this.selectedHrData.empDataByHR.empMName;  
    this.canditateName = this.selectedHrData.empDataByHR.empFName + ' '+this.selectedHrData.empDataByHR.empMName +' '+this.selectedHrData.empDataByHR.empLName; 
    this.encryptEmailId= this.selectedHrData.empDataByHR.empEmail;
    console.log('this.encryptEmailId', this.encryptEmailId);
    let enrpted = this.selectedHrData.empDataByHR.empEmail.trim().toString().split('sA1H').join('/').split('aD3p').join('+').split('Eq2l').join('=');
    this.decrptedEmpEmailId  = CryptoJS.AES.decrypt(enrpted.trim(),this.empFName.trim()).toString(CryptoJS.enc.Utf8);   
    let data = selectedHrData.confirmationDetail;
    // this.canditateName = this.selectedHrData.empDataByHR.empFName + ' '+this.selectedHrData.empDataByHR.empMName +' '+this.selectedHrData.empDataByHR.empLName ; 
    this.workLocation= this.selectedHrData.empDataByHR.workLocation;
    this.DOJ=this.selectedHrData.empDataByHR.DOJ;
    this.resendComment = selectedHrData.hrComments;
    if(data){
      this.referralName = data.referralName;
      this.referralCode = data.referralCode, 
      this.submitDate = data.submitDate, 
      this.submitLocation = data.submitLocation, 
      this.canditateName = this.selectedHrData.empDataByHR.empFName + ' '+this.selectedHrData.empDataByHR.empMName +' '+this.selectedHrData.empDataByHR.empLName; 
      this.canditateEmpCode = data.canditateEmpCode;
    }
  }

  backExperience() {
    console.log(this.session.get('confirmationDetail'));
    this.setData();
    if(this.isIpad == true){
      this.router.navigate(['/experiencedetail']);
    } else{        
      this.router.navigate(['/upload-document']);
    }
  }

  setData() {
    this.confirmationDetailData = { 
      confirmationDetail: {        
        referralName: this.referralName || '', 
        referralCode : this.referralCode || '', 
        submitDate : this.submitDate || null, 
        submitLocation: this.submitLocation || null, 
        canditateName: this.canditateName || '', 
        canditateEmpCode: this.canditateEmpCode || null
      },      
      hrComments: this.resendComment || null,
      status: this.status  || ''
    };    
    console.log('this.confirmationDetailData', this.confirmationDetailData);
    this.session.set('confirmationDetail', this.confirmationDetailData);  
  }
  // Submit function
  async saveData() {   
  
    this.setData();
    this.empdata.currentDataStatus.subscribe(status =>{ 
      this.apiStatus = status;
    })

    if((this.session.get('employeeDetail')== null) || (this.session.get('contactDetail')) == null) {
      const alert = await this.alertController.create({
        header: 'Please complete!',
        message: 'Please fill the mandatory details',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
      await alert.present();
    } 

    //Form completion alert
    if(this.isHrFlag == true){      
      console.log('comfirm id', this.id);       
      this.status = 'Completed';
      // this.hrData.setCandidateID(this.id);
      this.empdata.setDataStatus(this.status);  
      if(this.isIpad == true){
        this.empdata.setHrReviewStatus('Upload Document is not Done');  
      } else {
        this.empdata.setHrReviewStatus('Review completed By HR');  
      } 
      this.empdata.editData(this.id).subscribe(
        async data=>{        
          const alert = await this.alertController.create({
            header: 'Thanks!',
            message: 'Thank you for Submitting the Details and Completing the Review.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {                      
                  this.router.navigate(['/admin-user']).then(()=> location.reload());
                  window.sessionStorage.clear();           
                }
              }
            ]
          });
          await alert.present();
      },
        async error => {
          console.log('oops', error);
          this.errorAlert();
        }
      ); 
    }else{  
      this.status = 'Inprogress';
      this.empdata.setDataStatus(this.status); 
      const alert = await this.alertController.create({
        header: 'Thanks!',
        message: 'Thank you.. If you have Completing the Formality, Please Submit.',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay Emp');                
                this.saved = true;             
                this.empdata.editData(this.id);
            }
          }
        ]
      });
      await alert.present();
    }
  }
  //Save data
  async submitData() {
    console.log(this.saved);
    // console.log('confermation', this.canditateName, this.workLocation, this.DOJ);
    if(this.saved !== true) {
      console.log('save false');      
      this.setData();
  
      this.empdata.currentDataStatus.subscribe(status =>{ 
        this.apiStatus = status;
      })

      if((this.session.get('employeeDetail')== null) || (this.session.get('contactDetail')) == null) {
        const alert = await this.alertController.create({
          header: 'Please complete!',
          message: 'Please fill the mandatory details',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                console.log('Confirm Okay');
              }
            }
          ]
        });
        await alert.present();
      } else {                        
        this.status = 'Completed';                               
        this.empdata.setDataStatus('Completed'); 
        if(this.isIpad == true){
          this.empdata.setHrReviewStatus('Upload Document is not Done');  
        } else {
          this.empdata.setHrReviewStatus('Submitted for HR review');   
        }
        this.empdata.editData(this.id).subscribe(  
          async data => {            
            const alert = await this.alertController.create({
              header: 'Thanks!',
              message: 'Thank you for submitting the details. Please carry your originals and photograph as per defined configuration on your day one.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {                
                    this.hrData.sentMailToHr(this.canditateName, this.workLocation, this.DOJ);
                    this.router.navigate(['/login']);             
                    window.sessionStorage.clear();  
                  }
                }
              ]
            });
            await alert.present();    
          },
          async error => {
            console.log('oops', error);
            this.errorAlert();
          }
        );  
      }
    }else {       
      console.log('dsave else');      
      this.status = 'Completed'; 
      // this.hrData.setCandidateID(this.id);             
      this.empdata.setDataStatus(this.status);  
      if(this.isIpad == true){
        this.empdata.setHrReviewStatus('Upload Document is not Done');  
      } else { 
        this.empdata.setHrReviewStatus('Submitted for HR review');  
      } 
      this.empdata.editData(this.id).subscribe(  
        async data => {                 
        const alert = await this.alertController.create({
          header: 'Thanks!',
          message: 'Thank you for submitting the details. Please carry your originals and photograph as per defined configuration on your day one.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {               
                this.hrData.sentMailToHr(this.canditateName, this.workLocation, this.DOJ);                    
                this.router.navigate(['/login']);             
                window.sessionStorage.clear();  
              }
            }
          ]
        });
        await alert.present();  
      },
      error => {
        console.log('oops', error);
        this.errorAlert();
      }
    );      
    }
  }

  async errorAlert(){
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

  }

  resendMailToCandidate() {
    this.loading = true;
    this.status = 'Inprogress';
    this.empdata.setDataStatus(this.status); 
    this.session.set('confirmationDetail', this.confirmationDetailData);  
    let DOJFormate = moment(this.DOJ).format('YYYY-MM-DD');
    console.log(this.empFName, this.empMName, this.empLName);
    this.hrData.resendSMTP(this.decrptedEmpEmailId, this.encryptEmailId, this.empFName, this.empMName, this.empLName, this.resendComment).subscribe(
      async data => {    
        console.log(console.log('email', data)) ;
      const alert = await this.alertController.create({
        header: 'Email Sent!',
        message: 'Email is Sucessfully Sent to the Candidate.',
        buttons: [
          {
            text: 'Okay',
            handler: () => {                
              this.empdata.editData(this.id).subscribe(data=>{
                console.log('educ', data);                
                this.loading = false;
              },async err=> {        
                const alert = await this.alertController.create({
                  header: 'Error!',
                  message: 'Error: Failed to Save. Please try after sometime.',
                  buttons: [
                    {
                      text: 'Okay',
                      handler: () => {
                        this.loading = false;
                      }
                    }
                  ]
              });               
              alert.present(); 
            })
          }
        }
        ]
      });
      await alert.present();  
    },
    async error => {
      console.log('oops', error);
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Error: Failed to send Email. Please try after sometime.',
        buttons: [
          {
            text: 'Okay',
            handler: () => {this.loading = false;}
          }
        ]
      });
      await alert.present(); 
    })
  }

  editPage() {    
    this.isReadonly = false;
  }
  
  homePage() {
    window.sessionStorage.clear();
    this.router.navigate(['/admin-user']);
  }
}
