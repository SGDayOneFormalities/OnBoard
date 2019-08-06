import { Injectable, Directive  } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SessionStorageService } from 'angular-web-storage';
import { AlertController } from '@ionic/angular';
import { AppSettings } from './appSetting.config';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { subscribeOn } from 'rxjs/operators';
import { Router } from '@angular/router';
import {HrDataService} from './hr-data.service';
import { ToastController } from '@ionic/angular';

const emp_id = {};
@Injectable()
export class DataService {
  dataStatus: string = ''; 
  reviewStatus: string = '';      
  private dataDetail = new BehaviorSubject(this.dataStatus);
  currentDataStatus = this.dataDetail.asObservable(); 
  private messageSource = new BehaviorSubject('Default');
  currentMessage = this.messageSource.asObservable();
 
  // apiURL: string = 'http://10.2.108.65:4000/api/onboards';
  jsonData : any;
  postData: any;
  empFechedDataById : any;
  
  constructor(private hrDataSer: HrDataService, private toastCtrl: ToastController, private router:Router, httpClient: HttpClient, public http: Http, public session: SessionStorageService, private alertController: AlertController) { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  setEmpID(id){ 
    // console.log('setEmpID',id);
    emp_id['prop'] = id; 
  }

  getEmpID(flag){
    // console.log('getEmpID',emp_id['prop'], 'flag', flag);
    const URL =  AppSettings.UPLOADCERTIFICATE_URL+'?_id='+ emp_id['prop']+'&flag='+flag;
    return URL;
  }

  //post data on save  
  setEmployeedata(status, id) {
    if(this.session.get('employeeDetail') == null) {
      this.session.set('employeeDetail', {});
    }    
    if( this.session.get('contactDetail') == null) {      
      let contactDetailData = { 
        contactDetail:{     
          currentAddress: null,   
          currentPhone: null,
          currentResidingSince: null,
          emailId : this.session.get('empDataByHR').empEmail || null,
          emergencyContactno: null,
          emergencyPersonName: null,
          officialCorrespondence : null,
          presentAddress: null,
          presentAltPhone: null,
          presentPhone: null,
          residingSince: null,  
          emergencyMobile : null
        }
      };   
      this.session.set('contactDetail', contactDetailData);
    }   
    this.jsonData = Object.assign(this.session.get('employeeDetail') , this.session.get('contactDetail'),
    this.session.get('educationDetails'), this.session.get('experienceDetails'),this.session.get('confirmationDetail'));
    // if((this.jsonData !== undefined) || (this.jsonData !== null)){      
      this.postData = {
        "_id": id,
        empDataByHR: this.session.get('empDataByHR'),
        employeeDetails: this.jsonData, 
        status: status,
        updatedTime: new Date(), 
        hrComments: this.session.get('confirmationDetail') ? this.session.get('confirmationDetail').hrComments : null,  
        hrReviewStatus: this.reviewStatus ? this.reviewStatus : null,
        totalExperience: this.session.get('experienceDetails') ? this.session.get('experienceDetails').totalExperience : null   
      };  
      this.hrDataSer.changeAuthUser('authorizedUser');    
      localStorage.setItem('authUser', 'authorizedUser');
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers });
      
      this.http.post(AppSettings.POST_EMP_DATA, this.postData, options).subscribe(  
        data => {
          this.dataStatus = data.statusText;  
          // this.thankyouAlert(this.dataStatus);
          window.sessionStorage.clear();     
        },
        async error => {
          console.log('oops', error);
          const alert = await this.alertController.create({
            header: 'Error!',
            message: 'Add Details Failed. Please try after sometime.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {    
                }
              }
            ]
          });
          await alert.present(); 
        });
  }      

  async thankyouAlert(status) {
    if(status == 'OK') {
      //Form completion alert
      const alert = await this.alertController.create({
        header: 'Thanks!',
        message: 'Thank you for completing the formality.',
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
  }  
  
  setDataStatus(status){
    console.log('setDataStatus', status);
    this.dataDetail = status;
  }
  getDataStatus(){
    
    console.log('getDataStatus', this.dataDetail);
    return this.dataDetail;
  }

  setHrReviewStatus(status){
    this.reviewStatus = status;
  }

  getHrReviewStatus(){
    return this.reviewStatus;
  }
  //On employee home page by Hr
  getEmployeedata() {        
    return this.http.get(AppSettings.GET_EMP_DATA);
  }

  getAddressStates() {
    return this.http.get(AppSettings.GET_STATES);
  }

  editData(id) {   
    console.log('serv id', id); 
    if(this.session.get('employeeDetail') == null) {
      this.session.set('employeeDetail', {});
    }  
    localStorage.setItem('authUser', 'authorizedUser');
    this.hrDataSer.changeAuthUser('authorizedUser');
    console.log(this.session.get('employeeDetail') ,this.session.get('confirmationDetail'), this.session.get('contactDetail'),this.session.get('educationDetails')); 
    this.jsonData = Object.assign(this.session.get('employeeDetail') , this.session.get('contactDetail'),
    this.session.get('educationDetails'), this.session.get('experienceDetails'),this.session.get('confirmationDetail'));
    console.log(this.session.get('experienceDetails'), new Date());
    this.postData = {
      "_id": id,
      empDataByHR: this.session.get('empDataByHR'),
      employeeDetails: this.jsonData, 
      status: this.dataDetail,
      hrComments: this.session.get('confirmationDetail') ? this.session.get('confirmationDetail').hrComments : null,  
      updatedTime: new Date(), 
      hrReviewStatus: this.reviewStatus,
      totalExperience: this.session.get('experienceDetails') ? this.session.get('experienceDetails').totalExperience : null       
      };   
      console.log('this.postData', this.postData);
      return this.http.put(AppSettings.PUT_EMP_DATA+'?id=' + id, this.postData);
      // .subscribe(data=> console.log(data),
      // error=> console.log(error));
  }

  // Get data by Email id
  getLoginData(email) {
    this.empFechedDataById = this.http.get(AppSettings.LOGIN_EMP+'?email=' + email);
    console.log('this.empFechedDataById', this.empFechedDataById);
    return this.empFechedDataById;
  }

  getDataByID() {
    console.log(this.empFechedDataById);
    if(this.empFechedDataById == undefined){
      this.router.navigate(['/login']);
    }else
    return this.empFechedDataById;
  }

  getHRDataBylocation(location) {
    return this.http.get(AppSettings.HRDATA_BYLOC+'?loc=' +location);
  }

  readUploadData(userid) {
    console.log('read');
    return this.http.get(AppSettings.GET_UPLOADDATA+'?folder='+ userid);
  }

  deleteUpload(id, fileName){   
    let delDAta = {
      "id" : id,
      "filename" : fileName
    }
    console.log('delDAta', delDAta);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(AppSettings.POST_DEL_UPLOAD, delDAta,options)
  }
}