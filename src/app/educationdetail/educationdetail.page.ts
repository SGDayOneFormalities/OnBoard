import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {Employee} from '../employee.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { SessionStorageService } from 'angular-web-storage';
import { AlertController } from '@ionic/angular';
import {HrDataService} from '../hr-data.service';
import { MatDatepicker } from '@angular/material';
import { ToastController } from '@ionic/angular';

export interface degree {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-educationdetail',
  templateUrl: './educationdetail.page.html',
  styleUrls: ['./educationdetail.page.scss'],
})
export class EducationdetailPage implements OnInit {
  isReadonly: boolean =  false;
  contacts: Array<Employee>;
  maxDate:Date;  
  eduDetail: any;
  empDegree:string='';
  subject:string='';
  collAddress:string='';
  result:string='';
  fromYear:Date;
  gradYear:Date;
  isEdit: boolean =false;
  hideme:any;
  deg: string;
  sub: string;
  add: string;
  res: string;
  fromyr: string;
  tillyr: string;
  degrees: degree[] = [
    {value: 'BE', viewValue: 'Bachelor of Engineering'},    
    {value: 'BTec', viewValue: 'Bachelor of Technology'},
    {value: 'BSc', viewValue: 'Bachelor of Science'},    
    {value: 'MTec', viewValue: 'Master of Technology'},
    {value: 'MSc', viewValue: 'Master of Science'},
    {value: 'ME', viewValue: 'Master of Engineering'},    
    {value: 'MBA', viewValue: 'Master of Business Administration'},
    {value: 'Other', viewValue: 'Other'}
  ];
  toastMessage: string = '';
  selectedHrData: any;
  id: string;
  degreeValue: string;
  focus: boolean;  
  focus1: boolean;
  isHrFlag: boolean;
  isSaveflag: boolean = false;
  @ViewChild('picker') gradYearDate: MatDatepicker<Date>;

  constructor(public router: Router, private toastCtrl: ToastController, private hrData: HrDataService, private empdata: DataService, private route: ActivatedRoute, public session: SessionStorageService,public alertController: AlertController){
    this.contacts = [];
    this.maxDate = new Date();
  }  
  
  ngOnInit() {
    this.hrData.isHrFlag.subscribe(flag => {this.isHrFlag = flag});    
    console.log('this.isReadonly out', this.hrData.getReadFlag());
   
    if(this.hrData.getHrFlag()){
      this.session.get('educationDetails'); 
      this.isReadonly = this.hrData.getReadFlag();
      console.log('this.isReadonly in', this.isReadonly);     
      if(this.session.get('educationDetails')){  
        this.session.get('educationDetails').educationDetail.map(value =>{ 
          console.log('value degree', value.degree);
          // this.degreeValue= 
          let contact = new Employee(value.degree, value.subject , value.address, value.result , value.fromYear , value.gradYear , value.isEdit );
          this.contacts.push(contact);
          contact.isEdit = false;
        })    
      } else {
        this.hrData.empDataSelected.subscribe(selecteddata => {      
          this.selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
          if(this.selectedHrData){
            let selectedEmp = this.selectedHrData.employeeDetails.educationDetail;   
            this.id = this.selectedHrData._id;  
            selectedEmp.map(value =>{ 
              console.log('value.degree', value.degree);
                let alldata = value;
                  let contact = new Employee(value.degree, value.subject , value.address, value.result , value.fromYear , value.gradYear , value.isEdit );
                  this.contacts.push(contact);
                  contact.isEdit = false;
            })   
          let alldata = this.selectedHrData.employeeDetails.educationDetail;     
          }   
        });
      }      
      this.isReadonly = this.hrData.getReadFlag();
      console.log('this.isReadonly', this.isReadonly);
    } else {
      if(this.session.get('educationDetails')){  
        this.session.get('educationDetails').educationDetail.map(value =>{ 
          console.log('value', value);
          let contact = new Employee(value.degree, value.subject , value.address, value.result , value.fromYear , value.gradYear , value.isEdit );
          this.contacts.push(contact);
          contact.isEdit = false;
        })    
      } else {
        this.empdata.getDataByID().subscribe(data=> {
          let empLoginData= data.json();          
          this.id = empLoginData[0]._id;    
          // this.session.set('empDataByHR', empLoginData[0].empDataByHR);
          // if(empLoginData[0].employeeDetails.empPersonalData) {
          //   let employees = { empPersonalData: empLoginData[0].employeeDetails.empPersonalData} 
          //   this.session.set('employeeDetail', employees);
          // }   
          // if(this.session.get('contactDetail')){
          //   console.log('in session contactDetail', this.session.get('contactDetail'))
          //   // if(this.propagationFlag == false) { 
          //     this.session.set('contactDetail', this.session.get('contactDetail').contactDetail);
          //   // }
          // }else if (empLoginData[0].employeeDetails.contactDetail) {
          //   console.log("else contact");
          //   let contactDetailData = {contactDetail: empLoginData[0].employeeDetails.contactDetail };  
          //   this.session.set('contactDetail', contactDetailData); 
          // }    
          // if(empLoginData[0].employeeDetails.experienceDetail){
          //   let expDetail = { experienceDetail: empLoginData[0].employeeDetails.experienceDetail};
          //   this.session.set('experienceDetails', expDetail);
          // }  
          // if(empLoginData[0].employeeDetails.confirmationDetail){
          //   let confirmationDetailData = { confirmationDetail: empLoginData[0].employeeDetails.confirmationDetail             };
          //   this.session.set('confirmationDetail', confirmationDetailData); 
          // } 
          if(empLoginData[0].employeeDetails.educationDetail !== undefined){
            this.contacts = empLoginData[0].employeeDetails.educationDetail;
          }
        })    
      }
    }
  }

 //Confirmation for delete added detail
  async confirmation(contact) {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Do You Want to Remove The Detail.',
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
            this.removeContact(contact);
          }
        }
      ]
    });
    await alert.present();
  }

  async addContact(degree ,subject , address , result , fromYear , gradYear) {
    if(this.empDegree=='') this.empDegree=null;
    if(this.subject=='') this.subject=null;
     if(this.collAddress=='') this.collAddress=null;
     if(this.result=='') this.result=null;
     if(this.fromYear==undefined) this.fromYear=null;
    if (this.gradYear==undefined) this.gradYear=null;
    let fromYearFormate = moment(fromYear).format('YYYY-MM-DD');
    let gradYearFormate = moment(gradYear).format('YYYY-MM-DD');

    if(this.empDegree=='Other'){
      this.empDegree= this.degreeValue;
    }
    if (this.empDegree==null ||
      this.subject==null ||
      this.collAddress==null ||
      this.result==null ||
      this.fromYear==null ||
      this.gradYear==null) {          
        const alert = await this.alertController.create({
          header: 'Info',
          message: 'Please Add All Mandatory Education Details.',
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
    else if(this.empDegree!==null &&
      this.subject!==null &&
      this.collAddress!==null &&
      this.result!==null && 
      this.fromYear!==null && 
      this.gradYear!==null){       
        let isedit =  this.isEdit;
        let contact = new Employee(this.empDegree || null ,subject  || null, address || null, result || null, fromYearFormate || null, gradYearFormate || null, isedit || null);
        this.contacts.push(contact);
        console.log(this.isSaveflag);
        if(this.isSaveflag){
          
          this.eduDetail = { educationDetail: this.contacts}  ;  
          this.session.set('educationDetails',  this.eduDetail);            
        //   resolve(true);
        // });                  
        // addEdu.then((data) =>{
          console.log('newPage nav', this.eduDetail);
          // if((this.hrData.getHrFlag() ==false) || (this.hrData.getHrFlag() ==undefined)) {
          //   this.empdata.editData(this.id).subscribe(data=>{
          //     console.log('educ', data);
          //   },async err=> {        
          //     const toast = await this.toastCtrl.create({
          //       message: 'Error: Failed to Save. Please try after sometime.',
          //       color: 'primary',
          //       showCloseButton: true,
          //       position: 'top',
          //       cssClass: "className",
          //       duration: 2000
          //     });
          //     toast.present(); 
          //   }); 
          // }
            this.isSaveflag =false;
            this.router.navigate(['/experiencedetail']);
        }
        this.clearData();
    }
  }

  async nextExperience(){
    if(this.empDegree=='') this.empDegree=null;
    if(this.subject=='') this.subject=null;
     if(this.collAddress=='') this.collAddress=null;
     if(this.result=='') this.result=null;
     if(this.fromYear==undefined) this.fromYear=null;
    if (this.gradYear==undefined) this.gradYear=null;

    // if((this.hrData.getHrFlag() ==true)){
      
    //   this.router.navigate(['/experiencedetail']);
    // }
    if((this.empDegree==null) && (this.subject==null) &&
    (this.collAddress==null) &&  (this.result==null) &&
    (this.fromYear==null) && (this.gradYear==null)){
    if (this.contacts.length === 0) {
        const alert = await this.alertController.create({
          header: 'Info',
          message: 'Please Add Aleast One Education Detail.',
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
    }else if (this.contacts.length !== 0) {
      // Save page data in session and Navigate to next page
      this.eduDetail = { educationDetail: this.contacts}  ;
      this.session.set('educationDetails',  this.eduDetail);
      // if((this.hrData.getHrFlag() ==false) || (this.hrData.getHrFlag() ==undefined)) {          
        // this.empdata.setDataStatus('Inprogress'); 
        // console.log('next editeduc');      
        // this.empdata.editData(this.id).subscribe(data=>{
        //   console.log('educ', data);
        // },async err=> {        
        //   const toast = await this.toastCtrl.create({
        //     message: 'Error: Failed to Save. Please try after sometime.',
        //     color: 'primary',
        //     showCloseButton: true,
        //     position: 'top',
        //     cssClass: "className",
        //     duration: 2000
        //   });
        //   toast.present(); 
        // }); 
      // }
      this.router.navigate(['/experiencedetail']);

      }
    }else {
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
      }else {
      //
        const alert = await this.alertController.create({
          header: 'Info!',
          message: "Are You Sure, You Want To Save The Details.",
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            }, {
              text: 'Okay',
              handler: () => {  
                // let addEdu = new Promise(resolve => {
                  this.isSaveflag = true;
                  this.addContact(this.empDegree, this.subject,this.collAddress,this.result,this.fromYear, this.gradYear);  
                  
                  // }
                // });
              } 
            }
          ]
        });
        await alert.present();
  }
      
      // Save page data in session and Navigate to next page
      if((this.empDegree!==null && this.subject!==null &&
        this.collAddress!==null && this.result!==null && 
        this.fromYear!==null && this.gradYear!==null) || 
        ((this.empDegree==null) && (this.subject==null) &&
        (this.collAddress==null) &&  (this.result==null) &&
       (this.fromYear==null) && (this.gradYear==null)) ){ 
          this.eduDetail = { educationDetail: this.contacts}  ;
          this.session.set('educationDetails',  this.eduDetail);
          if((this.hrData.getHrFlag() ==false) || (this.hrData.getHrFlag() ==undefined)) {          
            this.empdata.setDataStatus('Inprogress');       
            this.empdata.editData(this.id);             
          }
      }
    }    
  }

  async validationEdu(){
    if (this.empDegree==null ||
      this.subject==null ||
      this.collAddress==null ||
      this.result==null ||
      this.fromYear==null ||
      this.gradYear==null){        
      const alert = await this.alertController.create({
        header: 'Info!',
        message: 'Please Add All Mandatory Education Details.',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
    }
  }

  async backContact() {   
    if(this.empDegree=='') this.empDegree=null;
    if(this.subject=='') this.subject=null;
     if(this.collAddress=='') this.collAddress=null;
     if(this.result=='') this.result=null;
     if(this.fromYear==undefined) this.fromYear=null;
    if (this.gradYear==undefined) this.gradYear=null;
      
    if((this.empDegree==null) && (this.subject==null) &&
    (this.collAddress==null) &&  (this.result==null) &&
    (this.fromYear==null) && (this.gradYear==null)){
      this.eduDetail = { educationDetail: this.contacts}  ;
      this.session.set('educationDetails',  this.eduDetail);        
      this.router.navigate(['/contactdetail']);
    } else {
      const alert = await this.alertController.create({
        header: 'Info!',
        message: "Unsaved Details Might Be Deleted. Are You Sure To Continue.?",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Okay',
            handler: () => {          
              this.eduDetail = { educationDetail: this.contacts}  ;
              this.session.set('educationDetails', this.eduDetail);         
              this.router.navigate(['/contactdetail']);
            } 
          }
        ]
      });
      await alert.present();  
    }
  }

  //Confirmation alert for clearing detail
  async cleardataConfirmation() {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Do You Want To Remove The Details.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.clearData();
          }
        }
      ]
    });
    await alert.present();
  }
  
  // Clear all fields
  clearData() {
    //TODO: check if no data in field
    this.isEdit = false;
    this.toastMessage = "Do You Want To Clear The Details."
    this.empDegree=null;
    this.subject=null;
    this.collAddress=null;
    this.result=null;
    this.fromYear=null;
    this.gradYear=null;
    this.degreeValue = null;
  }

  editContact(contact) {
    contact.isEdit = true; 
    this.isEdit = true;
    console.log('edit');
    for(let i =0; i<8; i++){
      console.log(this.degrees);
      console.log();
      console.log(contact.degree, contact.degree == 'Other');
    if(this.degrees[i].value == contact.degree){ 
      this.empDegree = contact.degree;
      }else{
        this.degreeValue = contact.degree;
        this.empDegree = 'Other';
      }
    }
    
    this.subject = contact.subject;
    this.collAddress = contact.address;
    this.result = contact.result;
    this.fromYear = contact.fromYear;
    this.gradYear = contact.gradYear;
  }

  cancelEdit(contact) {
    this.isEdit = false;
    contact.isEdit=false;
    this.clearData();
  }

  removeContact(contact){
    contact.isEdit=false;
    this.isEdit = false;
    this.clearData();
    sessionStorage.removeItem('educationDetails');
    let index = this.contacts.indexOf(contact);
    this.contacts.splice(index,1);    
  }

  // Save data after edit
  saveContact(contact, deg, sub, add, res, fromyr, tillyr) {
    contact.isEdit=false;
    this.isEdit = false;
    
    let fromYearFormate = moment(fromyr).format('YYYY-MM-DD');
    let gradYearFormate = moment(tillyr).format('YYYY-MM-DD');

    if(this.empDegree=='Other'){
      this.empDegree= this.degreeValue;
    }else {
      this.empDegree= deg;
    }

    let index = this.contacts.indexOf(contact);
    this.contacts.splice(index,1);
    contact = new Employee(this.empDegree, sub, add, res, fromYearFormate, gradYearFormate, contact.isedit );      
    this.contacts.push(contact);
    
    this.clearData();
  }

  homePage() {
    window.sessionStorage.clear();
    this.router.navigate(['/admin-user']);
  }

  editPage() {    
    this.isReadonly = false;
  }
}
