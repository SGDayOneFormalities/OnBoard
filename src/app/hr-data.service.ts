import { Injectable, Directive  } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './appSetting.config';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
// import { DataService } from './data.service';
import { SessionStorageService } from 'angular-web-storage';
import { Contact } from './contact';
import * as moment from 'moment';
import { delay } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable()
export class HrDataService {
  private flagValue : boolean;
  private readFlagValue :  boolean;
  jsonData : any;
  loc: any;
  doj: any;
  dFrom: any;
  dTo: any;
  emailSMTPData: any;
  smtpHrData: any;

  //TODO: static data service
  public selectedData = new BehaviorSubject([]);
  empDataSelected = this.selectedData.asObservable();

  private viewEmpData = new BehaviorSubject('Default');
  currentMessage = this.viewEmpData.asObservable();

  private authUser = new BehaviorSubject('noUser');
  currentAuthUser = this.authUser.asObservable();

  public completeEmpData = new BehaviorSubject({});
  AllEmpData = this.completeEmpData.asObservable();

  public isHr = new BehaviorSubject(false);
  isHrFlag = this.isHr.asObservable();
  
  constructor( private httpClient: HttpClient, public http: Http, public session: SessionStorageService, private toastCtrl: ToastController) { }

  changeMessage(message: string) {
    this.viewEmpData.next(message);
  }
  public setHrFlag(value){
    this.flagValue = value;
  }

  public getHrFlag(){
    return this.flagValue;
  }

  changeIsHr(value: boolean) {
    this.isHr.next(value);
  }

  public setReadFlag(value){
    this.readFlagValue = value;
  }

  public getReadFlag(){
    return this.readFlagValue;
  }

  // Get HR data
  getHrData() {
    // return this.http.put(AppSettings.PUT_EMP_DATA, );  
  }

  getDataByDOJ() {
    let DOJ = moment(new Date()).format('YYYY-MM-DD');
    return this.http.get(AppSettings.GET_DATA_BYDOJ + '?doj=' + DOJ);   
  }
  
  // setHrdata() {
  //   let canditateEmpCode = 108790;
  //   this.jsonData =  Object.assign(this.session.get('empDataByHR'));
  //   console.log(this.jsonData);
  //   if((this.jsonData !== undefined) || (this.jsonData !== null)){         
  //     const headers = new Headers({ 'Content-Type': 'application/json' });
  //     const options = new RequestOptions({ headers: headers });
      
  //     this.http.post(AppSettings.POST_EMP_DATA, this.jsonData, options).subscribe(  
  //       data => {
  //         console.log(data);        
  //       },
  //       error => console.log('oops', error)
  //     );
  //   }
  //   else { 
  //     console.log('new');
  //   }    
  //   this.getHrData();
  // }   

  loginToAdmin(username, password) {
    console.log('username, password', username, password);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    let logingData ={
      'user' : username,
      'pass' : password
    }
    return this.http.post(AppSettings.POST_LOGINDATA, logingData, options);    
  }

  changeAuthUser(user: string) {
    this.authUser.next(user);    
    localStorage.setItem('authUser', 'authorizedUser');
  }

  deleteRecord(recId){
    return this.http.delete(AppSettings.DELETE_DATA+'?id=' + recId);
  }

  advanceSearch(loc, doj , dFrom , dTo){  
    console.log('loc0', loc); 
    if(loc=='all'){
      this.loc = '?aloc=all';
    }else {      
      this.loc = '?loc=' + loc;      
    } 
    this.doj = '&doj=' + doj;
    this.dFrom = '&dFrom=' + dFrom;
    this.dTo = '&dTo=' + dTo;
    
    // let searchRes = this.http.get(AppSettings.ADVANCE_SEARCH + this.loc);
    // TODO: search on dates
    if(((doj == undefined || doj == null) && (dFrom == undefined || dTo == undefined))) {  
      console.log('loc');   
        return this.http.get(AppSettings.ADVANCE_SEARCH + this.loc);
    }
    if(dFrom == undefined && dTo == undefined) {
      return this.http.get(AppSettings.ADVANCE_SEARCH + this.loc + this.doj);
    }
    if(doj == undefined || doj == null) {
      return this.http.get(AppSettings.ADVANCE_SEARCH + this.loc + this.dFrom +  this.dTo);
    }
  }

  //TODO: static data service
  setSelectedData(data) {
    this.selectedData.next(data);
  }

  public getEmpData() {       
    // console.log('nowget', this.http.get(AppSettings.PUT_EMP_DATA));

  //  return this.http.put(AppSettings.PUT_EMP_DATA);
  }

  statusSearch(status) {
    return this.http.get(AppSettings.SEARCH_BYSATUS + '?status=' + status);
  }

  // generatePDF(data){
  //   const headers = new Headers({ 'Content-Type': 'application/json' });
  //   const options = new RequestOptions({ headers: headers });
  //   let genData = [data]; 
  //   console.log('gen data', genData);
  //   this.http.post(AppSettings.PDF_GENERATION, genData).subscribe(data => 
  //     {        
  //       console.log('gendata after', data.text() );
  //       let filePath =data.text();
  //       this.http.get(AppSettings.PDF_DOWNLOAD+'?fName='+ filePath).subscribe(data =>
  //         {            
  //       console.log(data );        
  //   window.open(data.url);
  //         });
  //     });
  // }
  
  //Send data to generate PDF
  sendDataToPDF(data){
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    let genData = [data]; 
    
    console.log('genData', genData);
    return new Promise(resolve => {
      setTimeout(() => {
        this.http.post(AppSettings.PDF_GENERATION, genData).pipe(delay(500)).subscribe(data => {
        resolve(data.text());
          // this.filePath =data.text();   
          }, 
          async err=> {        
            const toast = await this.toastCtrl.create({
              message: 'Error: Print failed. Please try after sometime.',
              color: 'primary',
              showCloseButton: true,
              position: 'top',
              cssClass: "className",
              duration: 2000
            });
            toast.present(); 
          });  
        }, 2000);
      });      
  }
  loading :boolean = true;
  //Print PDF
  async generatePDF(data){   
     this.sendDataToPDF(data).then(value =>{
      console.log('genval2', value);
      new Promise(resolve => {
        this.http.get(AppSettings.PDF_DOWNLOAD+'?fName='+ value,{
          responseType: ResponseContentType.Blob
        }).subscribe(
          (response) => { // download file
            var blob = new Blob([response.blob()], {type: 'application/pdf'});
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
            console.log(this.loading);
            resolve(this.loading);
        }, 
        async err=> {        
          const toast = await this.toastCtrl.create({
            message: 'Error: Print failed. Please try after sometime.',
            color: 'primary',
            showCloseButton: true,
            position: 'top',
            cssClass: "className",
            duration: 2000
          });
          toast.present(); 
        })
      });    
     }) 
  }
  public loadingProgress(){
    return this.loading = false;
  }

  downloadZip(id){
    return this.http.get(AppSettings.GET_ZIPFOLDER + '?fName=' + id).subscribe(data => {
      this.http.get(AppSettings.PDF_DOWNLOAD+'?fName='+ data.text()).subscribe(data =>{    
          window.open(data.url);
      }, 
      async error=> {        
        const toast = await this.toastCtrl.create({
          message: 'Error: Download failed. Please try after sometime.',
          color: 'primary',
          showCloseButton: true,
          position: 'top',
          cssClass: "className",
          duration: 2000
        });
        toast.present(); 
      })
    }), 
    async err=> {        
      const toast = await this.toastCtrl.create({
        message: 'Error: Download failed. Please try after sometime.',
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        cssClass: "className",
        duration: 2000
      });
      toast.present(); 
    };
  }

  emailSMTP(emailId, encryptMailId, empFName, empMName, empLName, workLocation, DOJFormate) { 
    console.log(emailId, encryptMailId, empFName, empMName, empLName, workLocation, DOJFormate);  
    this.emailSMTPData = {
      "emailId": emailId,
      "encEmail": encryptMailId,
      "empName": empFName.charAt(0).toUpperCase() + empFName.slice(1) + ' '+ (empMName ? (empMName + ' ') : '') + empLName,
      "empLoc": workLocation,
      "empDOJ": DOJFormate
    };
    console.log('emailId', this.emailSMTPData)
    
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    //10.2.108.65:8080/mailTrigger1/ old get
    return this.http.post('http://10.2.108.65:8000/mailTrigr', this.emailSMTPData, options);
  }

  resendSMTP(emailId, encryptMailId, empFName, empMName, empLName, resendComment) { 
    console.log(emailId, encryptMailId, empFName, empMName, empLName, resendComment);  
    this.emailSMTPData = {
      "emailId": emailId,
      "encEmail": encryptMailId,
      "empName": empFName.charAt(0).toUpperCase() + empFName.slice(1) + ' '+ (empMName ? (empMName + ' ') : '') + empLName,
      "hrComments": resendComment
    };
    console.log('emailId', this.emailSMTPData)
    
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    //10.2.108.65:8080/mailTrigger1/ old get
    return this.http.post(AppSettings.POST_RESEND_MAIL, this.emailSMTPData, options);
  }

  sentMailToHr(empFName, workLocation, DOJFormate ){
    this.smtpHrData = {
      "emailId": "balaji.pandiyan@scientificgames.com",
      "empName": empFName,
      "empLoc": workLocation,
      "empDOJ": DOJFormate
    }
    console.log('this.smtpHrData', this.smtpHrData);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    //10.2.108.65:8080/mailTrigger1/ old get
    this.http.post(AppSettings.POST_STMP_HR, this.smtpHrData, options).subscribe(  
      data => {   
        console.log(data)
      },
      error => console.log('oops', error)
    );  
  }

}