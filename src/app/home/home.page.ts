import { Component,
  ViewChild,
  ElementRef, OnInit, Injectable, Directive } from '@angular/core';
  import {
    FormControl
  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import {Contact} from '../contact';
import 'rxjs';
import { DataService } from '../data.service';
import { SessionStorageService } from 'angular-web-storage';
import {HrDataService} from '../hr-data.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { FileSelectDirective, FileDropDirective, FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
@Directive({ selector: '[ng2FileSelect]' })
@Directive({ selector: '[ng2FileDrop]' })

export class HomePage {
  employees: any = {};
  contacts: Array<Contact>;  
  fName: string;
  lName: string;
  mName: string;
  PAN: string;
  DOB: Date;
  empEmailId: string;
  itemList: any=[];
  toastMessage: string;
  maxDate: Date;  
  date: string;
  type: 'string';
  isReadonly: boolean =  false;
  stdNameFormat: string;
  maritalStatus: string;
  sex: string;
  fFName: string;
  fLName: string;
  fMName: string;
  selectedHrData: any;
  id: string;
  status: string;
  designation: string;
  focus: boolean;
  focus1: boolean;
  viewUser : boolean;
  nameChanged: boolean =false;
  nameChangeDate: Date;
  isDisabled: boolean =false;
  pickerDOB: any;
  pickerNameChangeDate:any;
  date1 = new Date();
  focusBtn: boolean = false;
  focusDateChng:boolean;
  
  filename: any =[];
  fileupload: any;
  uploadProgress: any;
  upstatus: boolean;
  uploader:FileUploader;
  errorMessage: string;
  allowedMimeType = ['application/pdf'];
  maxFileSize = 1 * 1024 * 1024; //1MB
  fileResponse: boolean;
  filePath: string;
  public loading = false;
  isHrFlag :boolean;
  propagationFlag: boolean = false;
  isIpad :  boolean = false;
  constructor(public plt: Platform, public menuCtrl: MenuController, public alertController: AlertController, public router: Router, private hrData: HrDataService, private empdata: DataService, private route: ActivatedRoute, private toastCtrl: ToastController, public session: SessionStorageService){
    console.log('plt', plt);
    this.contacts = [];      
    this.maxDate = new Date();
    this.checkPlatform();

    this.hrData.isHrFlag.subscribe(flag => {this.isHrFlag = flag});
    this.session.get('employeeDetail');
    if((this.hrData.getHrFlag() == undefined) || (this.hrData.getHrFlag() ==false)){
      this.empdata.getDataByID().subscribe(data=> {
        let value= data.json(); 
        this.id = value[0]._id;   
        this.empEmailId = value[0].empDataByHR.empEmail
        this.empdata.setEmpID(value[0]._id);  
        this.session.set('empDataByHR', value[0].empDataByHR);
        this.empdata.readUploadData(this.id).subscribe(data => {
          if(data.text().length >0){           
            data.json().forEach(element => {
              if((element.includes(".pdf") || element.includes(".PDF")) && (element.includes('PAN-'))){
                this.filename.push(element);
              }
            }); 
          }
        });
        // if(value[0].employeeDetails.contactDetail) {
        //   let contactDetailData = {contactDetail: value[0].employeeDetails.contactDetail }; 
        //   this.session.set('contactDetail', contactDetailData); 
        // }   
        // if(value[0].employeeDetails.educationDetail){
        //   let eduDetail = {educationDetail: value[0].employeeDetails.educationDetail};
        //   this.session.set('educationDetails',  eduDetail); 
        // }   
        // if(value[0].employeeDetails.experienceDetail){
        //   let expDetail = { experienceDetail: value[0].employeeDetails.experienceDetail};
        //   this.session.set('experienceDetails', expDetail);
        // }  
        // if(value[0].employeeDetails.experienceDetail){
        //   let expDetail = { experienceDetail: value[0].employeeDetails.experienceDetail};
        //   this.session.set('experienceDetails', expDetail);
        // }
        // if(value[0].employeeDetails.confirmationDetail){
        //   let confirmationDetailData = { confirmationDetail: value[0].employeeDetails.confirmationDetail             };
        //   this.session.set('confirmationDetail', confirmationDetailData); 
        // }   
        this.fName = value[0].empDataByHR.empFName;
        this.lName = value[0].empDataByHR.empLName;
        this.mName = value[0].empDataByHR.empMName;
        this.designation= value[0].empDataByHR.designation;
        if(this.session.get('employeeDetail') && ((this.propagationFlag == false))){
          console.log('in session contactDetail', this.propagationFlag)
          // if { 
            this.assignValue(this.session.get('employeeDetail'));
          // }
        }else if(this.propagationFlag == false){
          
          this.assignValue(value[0].employeeDetails);
        }
        // if(value[0].employeeDetails.empPersonalData == undefined) { 
        //     
        // }else{             
        //     this.fName = value[0].empDataByHR.empFName;
        //     this.lName = value[0].empDataByHR.empLName;
        //     this.mName = value[0].empDataByHR.empMName;
        //     this.PAN =  value[0].employeeDetails.empPersonalData.PAN; 
        //     this.DOB =  value[0].employeeDetails.empPersonalData.DOB; 
        //     this.nameChanged = value[0].employeeDetails.empPersonalData.nameChanged == "" ? false : value[0].employeeDetails.empPersonalData.nameChanged;
        //     this.isDisabled = this.nameChanged;
        //     this.nameChangeDate = value[0].employeeDetails.empPersonalData.nameChangeDate;
        //     this.stdNameFormat =  value[0].employeeDetails.empPersonalData.stdNameFormat;
        //     this.maritalStatus =  value[0].employeeDetails.empPersonalData.maritalStatus;
        //     this.sex =  value[0].employeeDetails.empPersonalData.sex;
        //     this.fFName =  value[0].employeeDetails.empPersonalData.fFName;
        //     this.fMName =  value[0].employeeDetails.empPersonalData.fMName;
        //     this.fLName =  value[0].employeeDetails.empPersonalData.fLName;
        // }
      })      
      this.status = 'Inprogress';
    }
    //TODO: static data service      
    if(this.hrData.getHrFlag()){
      this.hrData.changeIsHr(true);      
      this.hrData.empDataSelected.subscribe(selecteddata => { 
        // console.log(JSON.parse(JSON.stringify(selecteddata)));
        this.selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
        if (this.selectedHrData){
          // console.log('hr data is there')
          this.session.set('empDataByHR', this.selectedHrData.empDataByHR); 
          this.id = this.selectedHrData._id; 
          this.empdata.setEmpID(this.id);  
          this.empdata.readUploadData(this.id).subscribe(data => {
            if(data.text().length >0){
              data.json().forEach(element => {
                if((element.includes(".pdf") || element.includes(".PDF")) && (element.includes('PAN-'))){
                  // payalha_27-05-2019_23.04.32.650/SG-Logo.png
                  // let file = 'file://ws-in1021/wrkspace/Pdf%20generator/node-pdf-master/output/'+this.id+'/'+element
                  // window.open(file);
                  this.filename.push(element);
                }
              })
            }                 
          })    
          
        this.status = this.selectedHrData.status;   
        this.fName = this.selectedHrData.empDataByHR.empFName;
        this.lName = this.selectedHrData.empDataByHR.empLName;
        this.mName = this.selectedHrData.empDataByHR.empMName;
          if(this.session.get('employeeDetail') && ((this.propagationFlag == false))){
            console.log('in session contactDetail', this.propagationFlag)
            // if { 
              this.assignValue(this.session.get('employeeDetail'));
            // }
          }else if(this.propagationFlag == false){   
            this.assignValue(this.selectedHrData.employeeDetails);
          }
        }    
      });
      this.isReadonly = this.hrData.getReadFlag();      
    }
    
    
    // console.log('nameChange', this.nameChanged);
    // this.isDisabled = this.nameChanged || false;
    //item.file.name
    this.uploader = new FileUploader({
      url: this.empdata.getEmpID('true'),
      allowedMimeType: this.allowedMimeType,
      headers: [{name:'Accept', value:'application/pdf'}],
      autoUpload: true,
      maxFileSize: this.maxFileSize,
      // additionalParameter: { 'nameError': (item)=> this.onBeforeUploadItem(item)}
    });
    // this.uploader.onBeforeUploadItem = (item)=> this.onBeforeUploadItem(item);
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(filter);    
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    if((this.hrData.getHrFlag() == undefined) || (this.hrData.getHrFlag() ==false)){
      this.viewUser= true;
    }
    if(this.hrData.getReadFlag()){
      this.isReadonly =true;      
    }
    //todo: put this in home page
    this.empdata.getDataStatus();
  }

  assignValue(data){
    this.propagationFlag = true;
    if(data.empPersonalData) {
      this.PAN =  data.empPersonalData.PAN; 
      this.DOB =  data.empPersonalData.DOB; 
      //this.nameChanged = this.selectedHrData.employeeDetails.empPersonalData.nameChanged;
      this.nameChanged = data.empPersonalData.nameChanged == "" ? false : data.empPersonalData.nameChanged;
      this.isDisabled = this.nameChanged;
      this.nameChangeDate = data.empPersonalData.nameChangeDate;
      this.stdNameFormat = data.empPersonalData.stdNameFormat;
      this.maritalStatus =  data.empPersonalData.maritalStatus;
      this.sex =  data.empPersonalData.sex;
      this.fFName =  data.empPersonalData.fFName;
      this.fMName = data.empPersonalData.fMName;
      this.fLName =  data.empPersonalData.fLName; 
    } 
  }

  async checkPlatform(){
    if (this.plt.is('android')) {
      console.log("running on Android device!");
    }
    if (this.plt.is('ios')) {
        console.log("running on iOS device!");
    }
    if (this.plt.is('ipad')) {
      this.isIpad = true;
        console.log("running in a browser on ipad!");
    } else {
      this.isIpad = false;
    }
  }

  uploadClick(){
    this.loading = true;
    console.log('uploadclick', this.loading);
    setTimeout(() =>{this.loading = false;},7000)
    
  }
  // new Promise(resolve => {
  readUpload(){
    
    console.log('read upload');
    return new Promise(resolve => {
      setTimeout(() => {
        this.empdata.readUploadData(this.id).subscribe(data => {
          console.log('data', data.text().length)
          if(data.text().length >0){           
            data.json().forEach(element => {              
              if((element.includes(".pdf") || element.includes(".PDF")) && (element.includes('PAN-'))){
                this.filename.push(element);
        //         let path = 'http://10.2.108.65:8080/static02/'+this.id+'/'+element;                
        //         console.log(this.filePath);
              }
            }); 
          }
        });
        resolve();
        });
      });      
  }
  viewImg(file){
    console.log('viewimg');
    let filePath = 'http://10.2.108.65:8080/static02/'+this.id+'/'+file;
    window.open(filePath);         
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    
    // let data = JSON.parse(response); //success server response
    if(response == "File is uploaded")
    this.fileResponse =true;
    
    this.readUpload().then((data) => { 
      
    console.log('sucess read');     
    this.loading = false;
    });
  }

  async onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders){
    // let error = JSON.parse(response); //error server response
    this.fileResponse =false;
    this.loading = false;
    const toast = await this.toastCtrl.create({
      message: 'Error: Upload failed. Please try after sometime.',
      color: 'primary',
      showCloseButton: true,
      position: 'top',
      cssClass: "className",
      duration: 2000
    });
    toast.present(); 
    console.log('error', response);
  }

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  public fileOverAnother(e:any):void {   
    this.hasAnotherDropZoneOver = e;
  }

  //on Drag file
  public fileOverBase(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  // onBeforeUploadItem(item){
  //   console.log("Item"); 
  //   console.log((item.file.name.includes('PAN') || item.file.name.includes('Passport')), 'name', item.file.name);
  //   let itemNameError = (item.file.name.includes('PAN') || item.file.name.includes('Passport'));
  //   return itemNameError;
  // }
  onWhenAddingFileFailed(filter: any) {
    console.log('filter', filter.name);
    switch (filter.name) {
        case 'fileSize':
            this.errorMessage = `Maximum upload size(1MB) exceeded. `;
            this.uploadInfo(this.errorMessage);
            this.loading = false;
            break;
        case 'mimeType':
            const allowedTypes = this.allowedMimeType.join();
            this.errorMessage = `This file type is not allowed. Please add PDF file.`;
            this.uploadInfo(this.errorMessage);
            this.loading = false;
            break;
        default:
            this.errorMessage = `Unknown error (filter is ${filter.name})`;
            this.uploadInfo(this.errorMessage);
            this.loading = false;
            break;
    }
  }
  async uploadInfo(errorMsg){
    const alert = await this.alertController.create({
      header: 'Info!',
      message: errorMsg,
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

  async removeFile(fileSelected) {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Are You Sure Do You Want To Delete the File.?',
      buttons: [
        {
          text: 'Okay',
          handler: () => {  
            if(this.filename){   
              let index = this.filename.indexOf(fileSelected);
              this.filename.splice(index,1);
              console.log('del', this.filename)
              this.empdata.deleteUpload(this.id, fileSelected).subscribe(
                data => { },
                error => console.log('oops', error)  
              );
              // this.readUpload().then((data) => {
              //   });
            } 
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    await alert.present();
  }
  async removeFileitem(item) {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Are You Sure Do You Want To Delete the Record.?',
      buttons: [
        {
          text: 'Okay',
          handler: () => {    
              let index = this.uploader.queue.indexOf(item);
              this.uploader.queue.splice(index,1);
              this.empdata.deleteUpload(this.id, item.file.name).subscribe(
                data => { },
                error => console.log('oops', error)  
              );
          }
        },
        {
          text: 'Cancel',
          handler: () => {}
        }]
    });
    await alert.present();
  }  

  standAlert(){
    console.log(this.fName, this.lName,  this.mName);
    console.log('stdNameFormat', this.stdNameFormat);
    // if(this.fName + this.lName,  this.mName)

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  } 
  @ViewChild('elementDOBToFocus') DOBToFocus: ElementRef;
  @ViewChild('elementDateChangToFocus') _inputDateChang: ElementRef;
  @ViewChild(MatDatepicker) _picker: MatDatepicker<Date>;

  _dateFormControl: FormControl = new FormControl();

  openNameChangePicker(evt: MouseEvent, pickerNameChangeDate){
    if(this.focusDateChng == false) {pickerNameChangeDate.close(); this.focusDateChng = true}
    
    else { pickerNameChangeDate.open();
      this.focusDateChng=false;}
   
    pickerNameChangeDate.open();    
    setTimeout(() => {      
      this.focusDateChng=true;
      this._inputDateChang.nativeElement.focus();
      evt.stopPropagation();
    });
  }

  clearDateChng(){
    setTimeout(() => {      
      this.nameChangeDate=null;
      this._inputDateChang.nativeElement.blur();      
      this.focusDateChng=false;
    });
    event.stopImmediatePropagation();
  }

  closeDateChng(event) {
    setTimeout(() => {
      this._inputDateChang.nativeElement.blur();      
      this.focusDateChng=false;
    });
  }

  openDOBpicker(event, pickerDOB: MatDatepicker<Date>){
    pickerDOB.open();
    this.focusBtn=true;
    setTimeout(() => {       
      this.DOBToFocus.nativeElement.blur();     
      this.focusBtn=false;
    }, 3000)
  }

  clearDOBpicker(event, pickerDOB: MatDatepicker<Date>){  
    this.DOB=null;
    this.focusBtn=false;
    pickerDOB.close();
    event.stopImmediatePropagation();
  }

  closeDOBpicker(event){
    if(this.DOBToFocus.nativeElement.blur()){
      setTimeout(() => { 
        this.focusBtn=false;
      }, 500)
    }
  }

  ngOnInit() {
    //Data by employee login
    // this.empdata.empDataSelectedLogin.subscribe(data=> {
    //   let value= data;
    //     console.log('true', data);
    //     console.log(JSON.parse(JSON.stringify(data)));
    // })
    
  }
  
  dojOpen(){
    this.focus1=true;
    this.pickerDOB.open();
  }

  chngDate(){
    this.focus=true;
    this.pickerNameChangeDate.open()
  }
  // On next button click show validation modal
  async nextContact(fName,  mName, lName, stdNameFormat, nameChanged, nameChangeDate, PAN, DOB, sex, maritalStatus, fFName, fMName, fLName){    
    this.uploader.uploadAll(); 
    console.log('nameChangeDate', nameChangeDate);
    if(this.isReadonly ===false) {
      if(((nameChanged == true) && ((nameChangeDate == '') || (nameChangeDate == undefined))) || (fName=='') || (fName==undefined) || (DOB==undefined) || (lName == '')  || (lName == undefined) || (PAN == '')  || (PAN == undefined) || (PAN.length < 10) || ((this.uploader.queue.length == 0) && (this.filename===undefined))){
        if (((fName=='') || (fName==undefined)) && (DOB==undefined) && (lName == '')  || (lName == undefined)) {
          this.toastMessage= "Please Fill The Full Name and Date of Birth Mandatory Fields";
        }
        else if (DOB==undefined){        
          this.toastMessage="Please Fill The Date of Birth Field";
        }
        else if((fName=='') || fName==undefined || (lName == '')  || (lName == undefined)) {
          this.toastMessage= "Please Fill The Full Name Fields";
        }else if((this.uploader.queue.length == 0) && (this.filename===undefined)){
          this.uploadInfo('Please Upload All The Required Certificates');
        }else if((PAN=='') || (PAN==undefined)) {
          this.toastMessage= "Please Fill The PAN Number Field";
        }else if(PAN.length < 10) {
          this.toastMessage= "PAN Number must Be 10 Characters";
        }else if((nameChanged == true) && ((nameChangeDate == '') || (nameChangeDate == undefined))){
          this.toastMessage= "Please Fill The Name Change Date, As You Have Confirmed Change In Your Name";
        }
        const toast = await this.toastCtrl.create({
          message: this.toastMessage,
          color: 'primary',
          showCloseButton: true,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      else{   
        this.setData();
        
        // if((this.hrData.getHrFlag() ==false) || (this.hrData.getHrFlag() ==undefined)) {          
        //   this.empdata.setDataStatus(this.status);
        //   this.empdata.editData(this.id).subscribe(data=>{},async err=> {        
        //     const toast = await this.toastCtrl.create({
        //       message: 'Error: Failed to Save. Please try after sometime.',
        //       color: 'primary',
        //       showCloseButton: true,
        //       position: 'top',
        //       cssClass: "className",
        //       duration: 3000
        //     });
        //     toast.present(); 
        //   }); 
        // }
        
        if(((this.stdNameFormat == '') || ( this.stdNameFormat == null) ||( this.stdNameFormat == undefined))) {
          console.log('stdn :' + this.stdNameFormat);
          this.router.navigate(['/contactdetail']).then(() => this.session.get('contactDetail'));
        } else {
          console.log('fullname', (this.fName + (this.mName ? (this.mName) : '') + this.lName).replace(/\s/g, "")); 
          console.log('stdname', this.stdNameFormat.replace(/\s/g, ""));
        if(this.stdNameFormat.replace(/\s/g, "") != (this.fName + (this.mName ? (this.mName) : '') + this.lName).replace(/\s/g, "")) {
        console.log('std Name :' + this.stdNameFormat.replace(/\s/g, ""));
        console.log('concat Name' + this.fName + this.mName + this.lName);
        const alertNameMismatch = await this.alertController.create({
          header: 'Info!',
          message: 'Full Name & Standard Name does not match. Are you sure you want to continue.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {    
                this.router.navigate(['/contactdetail']).then(() => this.session.get('contactDetail'));
              }
            },
            {
              text: 'Cancel',
              handler: () => {}
            }]
        });
        await alertNameMismatch.present();
        } else {
        // Navigation to next page
          this.router.navigate(['/contactdetail']).then(() => this.session.get('contactDetail'));
        }}
      } 
    }  else {
      // Navigation to next page
      this.router.navigate(['/contactdetail']).then(() => this.session.get('contactDetail'));
    }
  } 

  setData() {    
    let nameChangeDateFormate = moment(this.nameChangeDate).format('YYYY-MM-DD');
    let DOBFormate = moment(this.DOB).format('YYYY-MM-DD');
    this.employees = {
      empPersonalData: {
        "fName": this.fName || '',  
        "mName": this.mName || '', 
        "lName": this.lName || '', 
        "stdNameFormat" : this.stdNameFormat || '', 
        "nameChanged" : this.nameChanged || '', 
        "nameChangeDate" : this.nameChangeDate? nameChangeDateFormate : null, 
        "PAN" : this.PAN || null,
        "DOB" : this.DOB ? DOBFormate : null , 
        "sex" : this.sex || '', 
        "maritalStatus": this.maritalStatus || null, 
        "fFName" : this.fFName || '',
        "fMName" : this.fMName || '',
        "fLName" : this.fLName || ''
      }
    };
    // Save page data in session
    this.session.set('employeeDetail', this.employees);
  }

  editPage() {    
    this.isReadonly = false;
  }

  homePage() {
    window.sessionStorage.clear();
    console.log('home');
    this.router.navigate(['/admin-user']);
  }

  saveByHR(fName, mName, lName, stdNameFormat, nameChanged, nameChangeDate, PAN, DOB, sex, maritalStatus, fFName, fMName, fLName){
    this.hrData.empDataSelected.subscribe(selecteddata => { 
      // console.log(JSON.parse(JSON.stringify(selecteddata)));
      this.selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
      if (this.selectedHrData){
        // console.log('hr data is there')
        this.session.set('empDataByHR', this.selectedHrData.empDataByHR); 
        this.id = this.selectedHrData._id; 
        this.empdata.setEmpID(this.id);  
        if(this.selectedHrData.employeeDetails.contactDetail) {
          let contactDetailData = {contactDetail: this.selectedHrData.employeeDetails.contactDetail }; 
          this.session.set('contactDetail', contactDetailData); 
        }   
        if(this.selectedHrData.employeeDetails.educationDetail){
          let eduDetail = {educationDetail: this.selectedHrData.employeeDetails.educationDetail};
          this.session.set('educationDetails',  eduDetail); 
        }   
        if(this.selectedHrData.employeeDetails.experienceDetail){
          let expDetail = { experienceDetail: this.selectedHrData.employeeDetails.experienceDetail};
          this.session.set('experienceDetails', expDetail);
        }  
        if(this.selectedHrData.employeeDetails.experienceDetail){
          let expDetail = { experienceDetail: this.selectedHrData.employeeDetails.experienceDetail};
          this.session.set('experienceDetails', expDetail);
        }
        if(this.selectedHrData.employeeDetails.confirmationDetail){
          let confirmationDetailData = { confirmationDetail: this.selectedHrData.employeeDetails.confirmationDetail             };
          this.session.set('confirmationDetail', confirmationDetailData); 
        }               
      }   
      let nameChangeDateFormate = moment(nameChangeDate).format('YYYY-MM-DD');
        let DOBFormate = moment(DOB).format('YYYY-MM-DD');
        this.employees = {
            empPersonalData: {
              "fName": fName || '',  
              "mName": mName || '', 
              "lName": lName || '', 
              "stdNameFormat" : stdNameFormat || '', 
              "nameChanged" : nameChanged || false, 
              "nameChangeDate" : nameChangeDate? nameChangeDateFormate : null, 
              "PAN" : PAN || null,
              "DOB" : DOB ? DOBFormate : null , 
              "sex" : sex || '', 
              "maritalStatus": maritalStatus || null, 
              "fFName" : fFName || '',
              "fMName" : fMName || '',
              "fLName" : fLName || ''
          }
        };
        // Save page data in session
        this.session.set('employeeDetail', this.employees); 
        console.log(this.status);
        this.empdata.setDataStatus(this.status);
        this.empdata.editData(this.id).subscribe(data=>{},async err=> {        
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
    });
  }
  
  backWelcome(){
    if(this.hrData.getHrFlag()){
      this.router.navigate(['/admin-user']);
      //TODO: check
      window.sessionStorage.clear();
    } else {    
      this.setData();
      this.router.navigate(['/welcome/'+this.empEmailId]);
    }
  }
}
