import { Component, OnInit } from '@angular/core';
import { Experience } from '../experience.interface';
import { SessionStorageService } from 'angular-web-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import {HrDataService} from '../hr-data.service';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-experiencedetail',
  templateUrl: './experiencedetail.page.html',
  styleUrls: ['./experiencedetail.page.scss'],
})
export class ExperiencedetailPage implements OnInit {  
  isReadonly: boolean =  false;
  contacts: Array<Experience> = [];
  maxDate: Date;
  expDetail: any;  
  experience:string='';
  company:string='';
  compFrom:Date;
  compTo:Date;
  location:number;
  designation:number;
  department:string;
  reason:string;
  managerName: string;
  managerDesignation: string;
  managerContact: string;
  managerEmail: string;
  isEdit: boolean =false;
  newEdit : boolean =false;
  experienceMsg: string;
  experienceDiffYear: string;
  experienceDiffMonth: string;
  experienceDiffDay: string;
  selectedHrData: any;
  id: string;
  totalExp: string;
  focus: boolean;  
  focus1: boolean;
  isHrFlag: boolean;
  isIpad :  boolean = false;
  constructor(public plt: Platform, public session: SessionStorageService, private hrData: HrDataService, public router: Router, private empdata: DataService, private toastCtrl: ToastController, public alertController: AlertController){
    // this.contacts;
    console.log('cons');
    this.maxDate = new Date();
    if (this.plt.is('ipad')) {
      this.isIpad = true;
        console.log("running in a browser on ipad!");
    } else {
      this.isIpad = false;
    }
  }

  ngOnInit() { 
    console.log('int');
    this.hrData.isHrFlag.subscribe(flag => {this.isHrFlag = flag});
    
    if(this.hrData.getHrFlag()){
      // console.log('get(experienceDetails)', this.session.get('experienceDetails'));
      if(this.session.get('experienceDetails')){  
        // console.log(this.session.get('experienceDetails'));
            this.session.get('experienceDetails').experienceDetail.map(value =>{ 
              // console.log('value', value);
                  let contact = new Experience(value.yearofExp, value.companyName , value.joining, value.leaving , value.worklocation , value.desig , value.domain, value.leavingReason , value.mName , value.mDesignation , value.mContact,  value.mEmail, value.isEdit);
                  this.contacts.push(contact);
                  contact.isEdit = false;
            })    
            // let alldata = this.selectedHrData.employeeDetails.experienceDetail;      
            this.totalExp = this.session.get('experienceDetails').totalExperience;
      }else{
        this.hrData.empDataSelected.subscribe(selecteddata => {  
          console.log('selecteddata', selecteddata);
          this.selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
          if(this.selectedHrData){
            let selectedEmp = this.selectedHrData.employeeDetails.experienceDetail;          
            this.session.set('empDataByHR', this.selectedHrData.empDataByHR);    
            this.id = this.selectedHrData._id;  
            selectedEmp.map(value =>{ 
                  let contact = new Experience(value.yearofExp, value.companyName , value.joining, value.leaving , value.worklocation , value.desig , value.domain, value.leavingReason , value.mName , value.mDesignation , value.mContact,  value.mEmail, value.isEdit);
                  this.contacts.push(contact);
                  console.log('this.contacts', this.contacts);
                  contact.isEdit = false;
            })    
            // let alldata = this.selectedHrData.employeeDetails.experienceDetail;      
            this.totalExp = this.selectedHrData.totalExperience;
            this.expDetail = { totalExperience: this.totalExp, experienceDetail: this.contacts}  ;
            // this.session.set('experienceDetails', this.expDetail);    
          }
        });
      }
      this.isReadonly = this.hrData.getReadFlag();
    }  else {
      if(this.session.get('experienceDetails')){  
        this.session.get('experienceDetails').experienceDetail.map(value =>{ 
          console.log('value', value);
              let contact = new Experience(value.yearofExp, value.companyName , value.joining, value.leaving , value.worklocation , value.desig , value.domain, value.leavingReason , value.mName , value.mDesignation , value.mContact,  value.mEmail, value.isEdit);
              this.contacts.push(contact);
              contact.isEdit = false;
        })    
        // let alldata = this.selectedHrData.employeeDetails.experienceDetail;      
        this.totalExp = this.session.get('experienceDetails').totalExperience;
      }else{
          this.empdata.getDataByID().subscribe(data=> {
            let empLoginData= data.json();          
            this.id = empLoginData[0]._id;    
            if(empLoginData[0].employeeDetails.experienceDetail !== undefined){
              this.contacts = empLoginData[0].employeeDetails.experienceDetail;
            }
            this.totalExp = empLoginData[0].totalExperience;
            this.expDetail = { totalExperience: this.totalExp, experienceDetail: this.contacts}  ;
            // this.session.set('experienceDetails', this.expDetail);    
          })   
        } 
    }
  }

  addExperience(yearofExp, companyName, joining, leaving, worklocation, desig, domain, leavingReason, mName, mDesignation, mContact, mEmail){
    let isedit =  this.isEdit;
    let joiningFormate = moment(joining).format('YYYY-MM-DD');
    let leavingFormate = moment(leaving).format('YYYY-MM-DD');
    let contact = new Experience(yearofExp || null , companyName || '' , joining ? joiningFormate : null , leaving ? leavingFormate : null , worklocation || '' , desig || '' , domain || '' , leavingReason || '' , mName || '' , mDesignation || '' , mContact || '' , mEmail || null, isedit || null);
    this.contacts.push(contact);
    this.clearExperience();
  }
  
  //Calculate experience
  calculateDateDiff(event) {
    if ((this.compTo !== null) && (this.compTo !== undefined)){
      let date2 = moment(this.compFrom);
      let date1= moment(this.compTo); 
      
      let years = date1.diff(date2, 'year');
      date2.add(years, 'years');

      let months = date1.diff(date2, 'months');
      date2.add(months, 'months');

      let days = date1.diff(date2, 'days');
      date2.add(days, 'days');

      if(years == 0) 
        this.experienceDiffYear = '';  
      if(years == 1)
        this.experienceDiffYear = years + ' year ';
      if(years > 1)
        this.experienceDiffYear = years + ' years ';
      if(months == 0) 
        this.experienceDiffMonth = '';  
      if(months == 1)
        this.experienceDiffMonth = months + ' month ';
      if(months > 1)
        this.experienceDiffMonth = months + ' months ';
      if(days == 0) 
        this.experienceDiffDay = '';  
      if(days == 1)
        this.experienceDiffDay = days + ' day ';
      if(days > 1)
        this.experienceDiffDay = days + ' days ';

      this.experience = this.experienceDiffYear +  this.experienceDiffMonth  + this.experienceDiffDay;
    }
  }
  //Confirmation for delete added detail
  async remConfirmation(contact) {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Do you want to remove the details.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.removeExperience(contact);
          }
        }
      ]
    });
    await alert.present();
  }

  removeExperience(contact){
    this.isEdit = false;
    contact.isEdit =false;
    this.clearExperience();
    let index = this.contacts.indexOf(contact);
    this.contacts.splice(index,1);
  }

  editExperience(contact) {
    contact.isEdit = true;
    this.isEdit = true;
    this.experience = contact.yearofExp;
    this.company= contact.companyName;
    this.compFrom= contact.joining;
    this.compTo=contact.leaving;
    this.location=contact.worklocation;
    this.designation=contact.desig;
    this.department=contact.domain;
    this.reason=contact.leavingReason;
    this.managerName=contact.mContact;
    this.managerDesignation=contact.mDesignation;
    this.managerContact=contact.mName;
    this.managerEmail=contact.mEmail;   
  }

  // Save data after edit
  saveExperience(contact) {
    contact.isEdit =false;
    contact.yearofExp = this.experience;
    contact.companyName =this.company;
    contact.joining= this.compFrom;
    contact.leaving= this.compTo;
    contact.worklocation = this.location;
    contact.desig = this.designation;
    contact.domain = this.department;
    contact.leavingReason = this.reason;
    contact.mContact = this.managerName;
    contact.mDesignation =this.managerDesignation;
    contact.mName = this.managerContact;
    contact.mEmail = this.managerEmail;  
    this.clearExperience();
  }

   //Confirmation alert for clearing detail
  async cleardataConfirmation() {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Do you want to Clear All the Details.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.clearExperience();
          }
        }
      ]
    });
    await alert.present();
  }

  // Clear all fields
  clearExperience() {
    this.isEdit=false;
    this.experience='';
    this.company='';
    this.compFrom=null;
    this.compTo=null;
    this.location=null;
    this.designation=null;
    this.department='';
    this.reason='';
    this.managerName='';
    this.managerDesignation='';
    this.managerContact='';
    this.managerEmail='';  
  }

  cancelEdit(contact) {
    this.isEdit = false;
    contact.isEdit=false;
    this.clearExperience();
  }

  async nextUpload() {       
    // Save page data in session and Navigate to next page
    if( (this.experience=='' || this.experience==undefined) &&
    (this.company=='' || this.company==undefined) &&
    (this.compFrom==null || this.company==undefined) &&
    (this.compTo==null || this.company==undefined) &&
    (this.location==null || this.company==undefined) &&
    (this.designation==null || this.company==undefined) &&
    (this.department=='' || this.department==undefined) &&
    (this.reason=='' || this.reason==undefined) &&
    (this.managerName=='' || this.managerName==undefined) &&
    (this.managerDesignation=='' || this.managerDesignation==undefined) &&
    (this.managerContact=='' || this.managerContact==undefined) &&
    (this.managerEmail=='' || this.managerEmail==undefined)){      
      if(this.contacts.length == 0) {
        let contact = new Experience(0, null , null, null , null, null , null , null , null , null , null ,  null , null);
        this.contacts.push(contact);
        this.expDetail = { totalExperience: this.totalExp, experienceDetail: this.contacts}  ;
      }else{
        this.expDetail = { totalExperience: this.totalExp,experienceDetail: this.contacts}  ;
      }
      this.session.set('experienceDetails', this.expDetail);
      if(this.isIpad == true){
        this.router.navigate(['/confirmationdetail']);
      } else{        
        this.router.navigate(['/upload-document']);
      }
    } else {
      if(this.isEdit == true){
        const alert = await this.alertController.create({
          header: 'Info!',
          message: "Please Save The Edited Details.",
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Okay',
              handler: () => {              
                } 
            }
          ]
        });
        await alert.present();        
      }else{
        const alert = await this.alertController.create({
        header: 'Info!',
        message: "Are You Sure, You Want To Save the Details.",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Okay',
            handler: () => {     
              this.addExperience(this.experience, this.company, this.compFrom,  this.compTo,  this.location,  this.designation,
                this.department, this.reason, this.managerName, this.managerDesignation, this.managerContact, this.managerEmail);         
              // if(this.contacts.length == 0) {
              //   let contact = new Experience(0, null , null, null , null, null , null , null , null , null , null ,  null , null);
              //   this.contacts.push(contact);
              //   this.expDetail = { totalExperience: this.totalExp, experienceDetail: this.contacts}  ;
              // }else{
                console.log(this.contacts);
                this.expDetail = { totalExperience: this.totalExp,experienceDetail: this.contacts}  ;
              // }
              this.session.set('experienceDetails', this.expDetail);
              if(this.isIpad == true){
                this.router.navigate(['/confirmationdetail']);
              } else{        
                this.router.navigate(['/upload-document']);
              }
            }
          }
        ]
      });
      await alert.present();
      }    
    }
  }

  async backEducation() {
    console.log('contacts', this.contacts);
    if( (this.experience=='' || this.experience==undefined) &&
    (this.company=='' || this.company==undefined) &&
    (this.compFrom==null || this.company==undefined) &&
    (this.compTo==null || this.company==undefined) &&
    (this.location==null || this.company==undefined) &&
    (this.designation==null || this.company==undefined) &&
    (this.department=='' || this.department==undefined) &&
    (this.reason=='' || this.reason==undefined) &&
    (this.managerName=='' || this.managerName==undefined) &&
    (this.managerDesignation=='' || this.managerDesignation==undefined) &&
    (this.managerContact=='' || this.managerContact==undefined) &&
    (this.managerEmail=='' || this.managerEmail==undefined)){
      console.log('contacts if  null', this.contacts);
      this.expDetail = { totalExperience: this.totalExp, experienceDetail: this.contacts}  ;
      this.session.set('experienceDetails', this.expDetail);        
      this.router.navigate(['/educationdetail']);
    } else {
      console.log('contacts back', this.contacts);
      this.expDetail = { totalExperience: this.totalExp, experienceDetail: this.contacts}  ;
      this.session.set('experienceDetails', this.expDetail);  
      console.log('contacts expDetail', this.expDetail);
      const alert = await this.alertController.create({
        header: 'Info!',
        message: "Unsaved Details Will Be Deleted.",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Okay',
            handler: () => {               
              this.router.navigate(['/educationdetail']);
            } 
          }
        ]
      });
      await alert.present();  
    }
  }

  homePage() {
    window.sessionStorage.clear();
    this.router.navigate(['/admin-user']);
  }

  editPage() {    
    this.isReadonly = false;
  }
}
