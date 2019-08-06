import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from '../data.service';
import { ToastController } from '@ionic/angular';
import { SessionStorageService } from 'angular-web-storage';
import {HrDataService} from '../hr-data.service';
import * as CryptoJS from 'crypto-js';

export interface depRelation {  
  value: string;
  viewValue: string;
}

export interface statesFormate{
  key:string;
  name:string;
}

@Component({
  selector: 'app-contactdetail',
  templateUrl: './contactdetail.page.html',
  styleUrls: ['./contactdetail.page.scss']
})

export class ContactdetailPage implements OnInit {   
  isReadonly: boolean =  false;
  contactDetailData : any ={};  
  toastMessage: string = '';
  toastMessage1: string = '';
  toastMessage2: string = '';
  toastMessage3: string= '';
  toastMessage4: string = '';
  toastMessage5: string = '';
  toastMessage6: string = '';
  getData : any;
  contactDetail: any;  
  // currAddress:string;
  selectedCorrespondence : string = 'permanentAdd';
  maxDate: Date = new Date();
  selectedHrData: any;
  perAddress: string;
  residingDate:string;
  perAltPhone:string;
  perPhone:string;
  empEmail:string;
  emergencyName:string;
  emergencyPhone:string;
  emergencyMobileNo: string;
  id: string;
  empFirstName: string;
  empLoginData : any;
  dependentName1 : string;
  // dependentMobileNo1: string;
  dependentName2: string;
  // dependentMobileNo2: string;
  dependentName3: string;
  // dependentMobileNo3: string;
  dependentName4 : string;
  // dependentMobileNo4:string;
  dependentName5 : string;
  // dependentMobileNo5 : string;
  dependentRelationship1 :string;
  dependentGender1 :string;
  dependentRelationship2 :string;
  dependentGender2 :string;
  dependentRelationship3 :string;
  dependentGender3 :string;
  dependentRelationship4 :string;
  dependentGender4 :string;
  dependentRelationship5 :string;
  dependentGender5 :string;
  dependent1Date :string;
  dependent2Date :string;
  dependent3Date :string;
  dependent4Date :string;
  dependent5Date :string;
  
  dependentRelationship: depRelation[] =[
    {value: 'Self', viewValue: 'Self'},   
    {value: 'Father', viewValue: 'Father'},    
    {value: 'FatherinLaw', viewValue: 'Father in Law'},
    {value: 'Mother', viewValue: 'Mother'},  
    {value: 'MotherinLaw', viewValue: 'Mother in Law'},    
    {value: 'Spouse', viewValue: 'Spouse'},
    {value: 'Child1', viewValue: 'Child 1'},
    {value: 'Child2', viewValue: 'Child 2'}
  ];

  states: statesFormate[] = [{"key":"AN","name":"Andaman and Nicobar Islands"},
  {"key":"AP","name":"Andhra Pradesh"}, {"key":"AR","name":"Arunachal Pradesh"},
  {"key":"AS","name":"Assam"},{"key":"BR","name":"Bihar"},
  {"key":"CG","name":"Chandigarh"},{"key":"CH","name":"Chhattisgarh"},
  {"key":"DH","name":"Dadra and Nagar Haveli"},{"key":"DD","name":"Daman and Diu"},
  {"key":"DL","name":"Delhi"},{"key":"GA","name":"Goa"},{"key":"GJ","name":"Gujarat"},
  {"key":"HR","name":"Haryana"},{"key":"HP","name":"Himachal Pradesh"},
  {"key":"JK","name":"Jammu and Kashmir"},{"key":"JH","name":"Jharkhand"},
  {"key":"KA","name":"Karnataka"},{"key":"KL","name":"Kerala"},{"key":"LD","name":"Lakshadweep"},
  {"key":"MP","name":"Madhya Pradesh"},{"key":"MH","name":"Maharashtra"},{"key":"MN","name":"Manipur"},
  {"key":"ML","name":"Meghalaya"},{"key":"MZ","name":"Mizoram"},{"key":"NL","name":"Nagaland"},{"key":"OR","name":"Odisha"},
  {"key":"PY","name":"Puducherry"},{"key":"PB","name":"Punjab"},{"key":"RJ","name":"Rajasthan"},{"key":"SK","name":"Sikkim"},
  {"key":"TN","name":"Tamil Nadu"},{"key":"TS","name":"Telangana"},{"key":"TR","name":"Tripura"},{"key":"UK","name":"Uttar Pradesh"},
  {"key":"UP","name":"Uttarakhand"},{"key":"WB","name":"West Bengal"}]

  focus: boolean;  
  focus1: boolean;
  focus2: boolean;
  focus3: boolean;
  focus4: boolean;
  focus5: boolean;
  focus6: boolean;
  sameAddress: boolean;  
  perAddressFlatNo :string ='';
  perAddressStreet :string = '';
  perAddressArea :string = '';
  perAddressDistrict :string = '';
  perAddressState :string= '';
  perAddressPin :string = '';
  currAddressFlatNo: string;
  currAddressStreet: string;
  currAddressArea: string;
  currAddressDistrict: string;
  currAddressState: string;
  currAddressPin: string;
  currResideingDate:string;
  currPhone: string;  
  isHrFlag: boolean;
  propagationFlag: boolean = false;
  constructor(public router: Router, private hrData: HrDataService, private empdata: DataService, private toastCtrl: ToastController, public session: SessionStorageService) {}

  ngOnInit() {  
    //TODO dynamic address
    // this.empdata.getAddressStates().subscribe(allStates => {
      
    //   console.log(JSON.parse(allStates.text()));
    //   console.log(JSON.parse(JSON.stringify(allStates.text())));
    //   let instate = JSON.parse(JSON.stringify(allStates.text()));
    //   console.log(instate.Object);
    // });  
    this.hrData.isHrFlag.subscribe(flag => {this.isHrFlag = flag});
    let contactData = this.session.get('contactDetail');
    console.log(this.propagationFlag, 'contactDetail', contactData);
    // let event  = new Event();
    // if(this.propagationFlag == false) { 
     
      if((this.hrData.getHrFlag() == undefined) || (this.hrData.getHrFlag() ==false)){
        this.empdata.getDataByID().subscribe(data=> {
          this.empLoginData= data.json();          
          this.id = this.empLoginData[0]._id;   
          this.empFirstName = this.empLoginData[0].empDataByHR.empFName;
          this.session.set('empDataByHR', this.empLoginData[0].empDataByHR);
          let enrpted = this.empLoginData[0].empDataByHR.empEmail.trim().toString().split('sA1H').join('/').split('aD3p').join('+').split('Eq2l').join('=');;
          this.empEmail  = CryptoJS.AES.decrypt(enrpted.trim(),this.empLoginData[0].empDataByHR.empFName.trim()).toString(CryptoJS.enc.Utf8);
          // if(this.empLoginData[0].employeeDetails.contactDetail) {
            
          // if(this.empLoginData[0].employeeDetails.empPersonalData) {
          //   let employees = { empPersonalData: this.empLoginData[0].employeeDetails.empPersonalData} 
          //   this.session.set('employeeDetail', employees);
          // }   
          // if(this.empLoginData[0].employeeDetails.educationDetail){
          //   let eduDetail = {educationDetail: this.empLoginData[0].employeeDetails.educationDetail};
          //   this.session.set('educationDetails',  eduDetail); 
          // }   
          // if(this.empLoginData[0].employeeDetails.experienceDetail){
          //   let expDetail = { experienceDetail: this.empLoginData[0].employeeDetails.experienceDetail};
          //   this.session.set('experienceDetails', expDetail);
          // }  
          // if(this.empLoginData[0].employeeDetails.confirmationDetail){
          //   let confirmationDetailData = { confirmationDetail: this.empLoginData[0].employeeDetails.confirmationDetail };
          //   this.session.set('confirmationDetail', confirmationDetailData); 
          // }
          // if(this.empLoginData[0].employeeDetails.contactDetail == undefined) { 
          //     this.empEmail = this.empLoginData[0].empDataByHR.empEmail;
          // }
          // else if(){
            console.log('this.session.get(contactDetai)', this.session.get('contactDetail'));
            
            if(this.session.get('contactDetail')){
              console.log('in session contactDetail', this.propagationFlag, this.session.get('contactDetail'))
              if(this.propagationFlag == false) { 
                console.log(contactData);
                this.assignValue(this.session.get('contactDetail').contactDetail);
              }
            } else if((this.empLoginData[0].employeeDetails.contactDetail) && (this.propagationFlag == false)) {
              let contactdetail = this.empLoginData[0].employeeDetails.contactDetail; 
              console.log('in data', contactdetail);
              this.assignValue(contactdetail);                       
            }
            // this.sameAddress = data.sameAddress;        
            // this.perAddressFlatNo = data.permanentAddressFlatNo;
            // this.perAddressStreet = data.permanentAddressStreet;
            // this.perAddressArea= data.permanentAddressArea;
            // this.perAddressDistrict= data.permanentAddressDistrict;
            // this.perAddressState= data.permanentAddressState;
            // this.perAddressPin= data.permanentAddressPin;
            // this.residingDate= data.permanentResidingSince;
            // this.perAltPhone= data.permanentAltPhone;
            // this.perPhone= data.permanentPhone;       
            // this.currAddressFlatNo = data.presentAddressFlatNo;
            // this.currAddressStreet = data.presentAddressStreet;
            // this.currAddressArea = data.presentAddressArea;
            // this.currAddressDistrict = data.presentAddressDistrict;
            // this.currAddressState = data.presentAddressState;
            // this.currAddressPin = data.presentAddressPin;
            // this.currResideingDate= data.residingSince;
            // this.currPhone= data.presentPhone;
            // this.selectedCorrespondence= data.officialCorrespondence;
            // this.emergencyName= data.emergencyPersonName;
            // this.emergencyPhone= data.emergencyContactno;
            // this.emergencyMobileNo = data.emergencyMobile;
            // this.dependentName1 = data.dependantName1;
            // this.dependentName2 = data.dependantName2;
            // this.dependentName3 = data.dependantName3;            
            // this.dependentName4 = data.dependantName4;
            // this.dependentName5 = data.dependantName5;        
            // this.dependent1Date = data.dependant1DobDate;
            // this.dependent2Date = data.dependant2DobDate;
            // this.dependent3Date = data.dependant3DobDate;
            // this.dependent4Date = data.dependant4DobDate;
            // this.dependent5Date = data.dependant5DobDate;
            // this.dependentRelationship1 = data.dependantRelationship1;
            // this.dependentGender1 = data.dependantGender1;
            // this.dependentRelationship2  = data.dependantRelationship2;
            // this.dependentGender2 = data.dependantGender2;
            // this.dependentRelationship3 = data.dependantRelationship3;
            // this.dependentGender3 = data.dependantGender3;
            // this.dependentRelationship4 = data.dependantRelationship4;
            // this.dependentGender4 = data.dependantGender4;
            // this.dependentRelationship5 = data.dependantRelationship5;
            // this.dependentGender5 = data.dependantGender5;
          // }
        })
      }
      if(this.hrData.getHrFlag()){
        console.log('this.propagationFlag hrloop', this.propagationFlag);
          this.hrData.empDataSelected.subscribe(selecteddata => {      
            this.selectedHrData = JSON.parse(JSON.stringify(selecteddata));  
            if(this.selectedHrData){
              this.id = this.selectedHrData._id;            
              this.empFirstName = this.selectedHrData.empDataByHR.empFName;
              let enrpted = this.selectedHrData.empDataByHR.empEmail.trim().toString().split('sA1H').join('/').split('aD3p').join('+').split('Eq2l').join('=');;
              this.empEmail  = CryptoJS.AES.decrypt(enrpted.trim(),this.selectedHrData.empDataByHR.empFName.trim()).toString(CryptoJS.enc.Utf8);  
              let data = this.selectedHrData.employeeDetails.contactDetail;              
              if(this.session.get('contactDetail')){
                console.log('in session contactDetail', this.propagationFlag)
                if(this.propagationFlag == false) { 
                  this.assignValue(contactData.contactDetail);
                }
              }else 
              if((this.selectedHrData.employeeDetails.contactDetail) && (this.propagationFlag == false)) {
                // if() {
                  this.assignValue(data);
                // }
              }
            }
          });
        this.isReadonly = this.hrData.getReadFlag();
      }
    // }
  }

  assignValue(data){
    console.log(data, ' propagationFlag', this.propagationFlag);
    this.propagationFlag = true;
    this.sameAddress = data.sameAddress;        
    this.perAddressFlatNo = data.permanentAddressFlatNo;
    this.perAddressStreet = data.permanentAddressStreet;
    this.perAddressArea= data.permanentAddressArea;
    this.perAddressDistrict= data.permanentAddressDistrict;
    this.perAddressState= data.permanentAddressState;
    this.perAddressPin= data.permanentAddressPin;
    // this.perAddress = data.presentAddress;
    this.residingDate= data.permanentResidingSince;
    this.perAltPhone= data.permanentAltPhone;
    this.perPhone= data.permanentPhone;   
    this.currAddressFlatNo = data.presentAddressFlatNo;
    this.currAddressStreet = data.presentAddressStreet;
    this.currAddressArea = data.presentAddressArea;
    this.currAddressDistrict = data.presentAddressDistrict;
    this.currAddressState = data.presentAddressState;
    this.currAddressPin = data.presentAddressPin;
    this.currResideingDate= data.residingSince;
    this.currPhone= data.presentPhone;
    this.selectedCorrespondence= data.officialCorrespondence;
    this.emergencyName= data.emergencyPersonName;
    this.emergencyPhone= data.emergencyContactno;
    this.emergencyMobileNo = data.emergencyMobile;
    this.dependentName1 = data.dependantName1;
    // this.dependentMobileNo1 = data.dependantMobileNo1;
    this.dependentName2 = data.dependantName2;
    // this.dependentMobileNo2 = data.dependantMobileNo2;
    this.dependentName3 = data.dependantName3;
    // this.dependentMobileNo3 = data.dependantMobileNo3;              
    this.dependentName4 = data.dependantName4;
    // this.dependentMobileNo4 = data.dependantMobileNo4;
    this.dependentName5 = data.dependantName5;
    // this.dependentMobileNo5 = data.dependantMobileNo5;
    this.dependent1Date = data.dependant1DobDate;
    this.dependent2Date = data.dependant2DobDate;
    this.dependent3Date = data.dependant3DobDate;
    this.dependent4Date = data.dependant4DobDate;
    this.dependent5Date = data.dependant5DobDate;
    this.dependentRelationship1 = data.dependantRelationship1;
    this.dependentGender1 = data.dependantGender1;
    this.dependentRelationship2  = data.dependantRelationship2;
    this.dependentGender2 = data.dependantGender2;
    this.dependentRelationship3 = data.dependantRelationship3;
    this.dependentGender3 = data.dependantGender3;
    this.dependentRelationship4 = data.dependantRelationship4;
    this.dependentGender4 = data.dependantGender4;
    this.dependentRelationship5 = data.dependantRelationship5;
    this.dependentGender5 = data.dependantGender5;
    // event.stopImmediatePropagation();
    // event.stopPropagation();
  }

  // Mandatory field validation
  async nextEducation(perAddressFlatNo, perAddressStreet, perAddressArea, perAddressDistrict, perAddressState, perAddressPin, residingDate, perAltPhone, perPhone, empEmail, currAddress, currResideingDate, currPhone, selectedCorrespondence, emergencyName,emergencyPhone, emergencyMobileNo, dependentName1, dependentName2, dependentName3, dependentName4, dependentName5, dependent1Date,dependent2Date,dependent3Date,dependent4Date,dependent5Date) {
    let pattern  = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/i;
    this.toastMessage = '';
    this.toastMessage1 = '';
    this.toastMessage2 = '';
    this.toastMessage3 = '';
    this.toastMessage4 = '';
    this.toastMessage5 = '';
    this.toastMessage6 = '';
    this.perAddress = perAddressFlatNo+ perAddressStreet+ perAddressArea+ perAddressDistrict+ perAddressState+ perAddressPin;

    console.log('dependent', this.dependentName1);
    if(this.dependentName1 == '' || this.dependentName2 == '' || this.dependentName3 == ''){
      this.dependentName1 = undefined;
      this.dependentName2 = undefined;
      this.dependentName3 = undefined;
      console.log('errrt', this.dependentName1 == undefined, this.dependentName1 == '');
    }
    console.log(perAddressFlatNo=='', perAddressFlatNo== null,  (this.perAddressFlatNo==''), (this.perAddressFlatNo==null))
    console.log('perAddress', (this.perAddressFlatNo=='') || ( this.perAddressStreet=='') || (this.perAddressArea=='') ||  (this.perAddressDistrict=='') || ( this.perAddressState=='') ||  (this.perAddressPin==''));
    console.log('dependentName1', !(this.dependentName1 == undefined && this.dependentRelationship1 == undefined && this.dependentGender1 == undefined && this.dependent1Date == undefined) && (
      (!(this.dependentName1 !== undefined && this.dependentRelationship1 !== undefined && this.dependentGender1 !== undefined && this.dependent1Date !== undefined))
    ));

    if((pattern.test(this.empEmail) === false) || (this.perAddress=='') || (empEmail=='') || (perPhone=='') || (residingDate=='') || (emergencyMobileNo=='') ||
    ((this.perAddressFlatNo=='') || ( this.perAddressStreet=='') || (this.perAddressArea=='') ||  (this.perAddressDistrict=='') || ( this.perAddressState=='') ||  (this.perAddressPin=='')) ||
    ((this.perAddressFlatNo==undefined) || ( this.perAddressStreet==undefined) || (this.perAddressArea==undefined) ||  (this.perAddressDistrict==undefined) || ( this.perAddressState==undefined) ||  (this.perAddressPin==undefined)) ||  
    (this.perAddress==undefined) || (empEmail==undefined) || (perPhone==undefined) || (residingDate==undefined) || (emergencyMobileNo==undefined) || (emergencyName==undefined || emergencyName == '') ||
    (((!(this.dependentName1 == undefined && this.dependentRelationship1 == undefined && this.dependentGender1 == undefined && this.dependent1Date == undefined)) && 
    (!(this.dependentName1 !== undefined && this.dependentRelationship1 !== undefined && this.dependentGender1 !== undefined && this.dependent1Date !== undefined))) ||
    (!(this.dependentName2 == undefined && this.dependentRelationship2 == undefined && this.dependentGender2 == undefined && this.dependent2Date == undefined)) && 
    (!(this.dependentName2 !== undefined && this.dependentRelationship2 !== undefined && this.dependentGender2 !== undefined && this.dependent2Date !== undefined)) ||
      (!(this.dependentName3 == undefined && this.dependentRelationship3 == undefined && this.dependentGender3 == undefined && this.dependent3Date == undefined)) &&
      (!(this.dependentName3 !== undefined && this.dependentRelationship3 !== undefined && this.dependentGender3 !== undefined && this.dependent3Date !== undefined)) ||
      (!(this.dependentName4 == undefined && this.dependentRelationship4 == undefined && this.dependentGender4 == undefined && this.dependent4Date == undefined)) && 
      (!(this.dependentName4 !== undefined && this.dependentRelationship4 !== undefined && this.dependentGender4 !== undefined && this.dependent4Date !== undefined)) ||
      (!(this.dependentName5 == undefined && this.dependentRelationship5 == undefined && this.dependentGender5 == undefined && this.dependent5Date == undefined)) &&
      (!(this.dependentName5 !== undefined && this.dependentRelationship5 !== undefined && this.dependentGender5 !== undefined && this.dependent5Date !== undefined)))){     
      
    console.log('currAddress', currAddress , (perAddressState == null), perAddressState == '');
      if (this.perAddress=='' || this.perAddress==undefined) {
        this.toastMessage = "\n- Permanent Address";
      } else
      if((this.perAddressFlatNo=='') || ( this.perAddressStreet=='') || (this.perAddressArea=='') ||  (this.perAddressDistrict=='') || ( this.perAddressState=='') ||  (this.perAddressPin=='') ||
      (this.perAddressFlatNo==undefined) || ( this.perAddressStreet==undefined) || (this.perAddressArea==undefined) ||  (this.perAddressDistrict==undefined) || ( this.perAddressState==undefined) ||  (this.perAddressPin==undefined)){
        this.toastMessage = "\n- Permanent Address all Fields";
      }
      if ((empEmail=='' || empEmail==undefined ) || (pattern.test(this.empEmail) == false)) {
        this.toastMessage1 = "\n- Email Id";
      }
      if (perPhone=='' || perPhone==undefined) {
        this.toastMessage2 =  "\n- Phone Number for Permanent Address";
      }
      if (residingDate=='' || residingDate==undefined) {
        this.toastMessage3 = "\n- Residing Since for Permanent Address ";
      } 
      if (emergencyMobileNo=='' || emergencyMobileNo==undefined) {
        this.toastMessage4 = "\n- Emergency Mobile Number";
      }  
      if(emergencyName == '' || emergencyName== undefined){
        this.toastMessage5 = "\n- Emergency Contact Person Name";
      }
      if((!(this.dependentName1 == undefined && this.dependentRelationship1 == undefined && this.dependentGender1 == undefined && this.dependent1Date == undefined)) && 
        (!(this.dependentName1 !== undefined && this.dependentRelationship1 !== undefined && this.dependentGender1 !== undefined && this.dependent1Date !== undefined)))
        this.toastMessage6 = "\n- Please Add Complete Details Of The Dependant 1";
      if((!(this.dependentName2 == undefined && this.dependentRelationship2 == undefined && this.dependentGender2 == undefined && this.dependent2Date == undefined)) && 
      (!(this.dependentName2 !== undefined && this.dependentRelationship2 !== undefined && this.dependentGender2 !== undefined && this.dependent2Date !== undefined)))
        this.toastMessage6 = "\n- Please Add Complete Details Of The Dependant 2";
      if((!(this.dependentName3 == undefined && this.dependentRelationship3 == undefined && this.dependentGender3 == undefined && this.dependent3Date == undefined)) &&
      (!(this.dependentName3 !== undefined && this.dependentRelationship3 !== undefined && this.dependentGender3 !== undefined && this.dependent3Date !== undefined)) )
      this.toastMessage6 = "\n- Please Add Complete Details Of The Dependant 3";
      if((!(this.dependentName4 == undefined && this.dependentRelationship4 == undefined && this.dependentGender4 == undefined && this.dependent4Date == undefined)) && 
      (!(this.dependentName4 !== undefined && this.dependentRelationship4 !== undefined && this.dependentGender4 !== undefined && this.dependent4Date !== undefined)))
      this.toastMessage6 = "\n- Please Add Complete Details Of The Dependant 4";
      if((!(this.dependentName5 == undefined && this.dependentRelationship5 == undefined && this.dependentGender5 == undefined && this.dependent5Date == undefined)) &&
      (!(this.dependentName5 !== undefined && this.dependentRelationship5 !== undefined && this.dependentGender5 !== undefined && this.dependent5Date !== undefined))) {
        this.toastMessage6 = "\n- Please Add Complete Details Of The Dependant 5";
      }
      const toast = await this.toastCtrl.create({
        message: 'Please fill mandatory fields:'+ this.toastMessage + this.toastMessage1 + this.toastMessage2 + this.toastMessage3 +this.toastMessage4 + this.toastMessage5 + this.toastMessage6,
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        cssClass: "className",
        duration: 2000
      });
      toast.present();
    }
    else{    
      this.setData();
      
      // if((this.hrData.getHrFlag() ==false) || (this.hrData.getHrFlag() ==undefined)) { 
      // console.log(this.contactDetailData);    
      
      //   this.session.set('contactDetail', this.contactDetailData);     
      //   this.empdata.setDataStatus('Inprogress');       
      //   let employees = {
      //     empPersonalData: this.empLoginData[0].employeeDetails.empPersonalData
      //   };
      //   this.session.set('employeeDetail', employees);
        // this.empdata.editData(this.id).subscribe(data=>{},async err=> {        
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
      this.router.navigate(['/educationdetail'], this.contactDetailData);
    }
  }

  setData() {
    let currResideingDateFormate = moment(this.currResideingDate).format('YYYY-MM-DD');
      let residingDateFormate = moment(this.residingDate).format('YYYY-MM-DD');      
      // this.empEmail = CryptoJS.AES.encrypt(empEmail.trim(), this.empFirstName.trim()).toString().split('/').join('sA1H').split('+').join('aD3p').split('=').join('Eq2l');;
      this.contactDetailData = { 
        contactDetail:{   
          "sameAddress" : this.sameAddress || null,     
          "presentAddressFlatNo": this.currAddressFlatNo,
          "presentAddressStreet": this.currAddressStreet,
          "presentAddressArea": this.currAddressArea,
          "presentAddressDistrict": this.currAddressDistrict,
          "presentAddressState": this.currAddressState,
          "presentAddressPin": this.currAddressPin, 
          "presentPhone": this.currPhone || '',
          "residingSince": this.currResideingDate ? currResideingDateFormate : null,
          "permanentPhone": this.perPhone || '',
          "permanentResidingSince": this.residingDate ? residingDateFormate : null,
          "permanentAddressFlatNo": this.perAddressFlatNo || '',
          "permanentAddressStreet": this.perAddressStreet || '',
          "permanentAddressArea": this.perAddressArea || '',
          "permanentAddressDistrict": this.perAddressDistrict || '',
          "permanentAddressState": this.perAddressState || '',
          "permanentAddressPin": this.perAddressPin || '',
          "permanentAltPhone": this.perAltPhone || '',
          "emailId" : this.empEmail || '',
          "emergencyContactno": this.emergencyPhone || '',
          "emergencyPersonName": this.emergencyName || '',
          "officialCorrespondence" : this.selectedCorrespondence || null,
          "emergencyMobile" : this.emergencyMobileNo ||null,
          "dependantName1" : this.dependentName1 || null,
          "dependantName2": this.dependentName2 || null,
          "dependantName3": this.dependentName3 || null,
          "dependantName4": this.dependentName4 || null,
          "dependantName5": this.dependentName5 || null,
          "dependant1DobDate": this.dependent1Date || null,
          "dependant2DobDate": this.dependent2Date || null,
          "dependant3DobDate": this.dependent3Date || null,
          "dependant4DobDate": this.dependent4Date || null,
          "dependant5DobDate": this.dependent5Date || null,
          "dependantRelationship1": this.dependentRelationship1 || null,
          "dependantGender1": this.dependentGender1 || null,
          "dependantRelationship2": this.dependentRelationship2 || null,
          "dependantGender2": this.dependentGender2 || null,
          "dependantRelationship3": this.dependentRelationship3 || null,
          "dependantGender3": this.dependentGender3 || null,
          "dependantRelationship4": this.dependentRelationship4 || null,
          "dependantGender4": this.dependentGender4 || null,
          "dependantRelationship5": this.dependentRelationship5 || null,
          "dependantGender5": this.dependentGender5 || null,
        }
      };    
      console.log('isHR',(this.hrData.getHrFlag() ==false) || (this.hrData.getHrFlag() ==undefined));
      // Save page data in session and Navigate to next page
      this.session.set('contactDetail', this.contactDetailData);
      console.log(this.session.get('contactDetail'));
  }

  // Copy permanent address to current address 
  onSameAddress(sameAddress,perAddressFlatNo,perAddressStreet,perAddressArea,perAddressDistrict, perAddressState, perAddressPin, residingDate, perPhone){
    if(sameAddress==true){
      // this.currAddress = perAddress;
      this.currAddressFlatNo= perAddressFlatNo;
      this.currAddressStreet =perAddressStreet;
      this.currAddressArea = perAddressArea;
      this.currAddressDistrict = perAddressDistrict;
      this.currAddressState = perAddressState;
      this.currAddressPin = perAddressPin;
      this.currResideingDate = residingDate;
      this.currPhone = perPhone;
    }
    else if (sameAddress==false) {
      // this.currAddress='';
      this.currAddressFlatNo= '';
      this.currAddressStreet ='';
      this.currAddressArea = '';
      this.currAddressDistrict = '';
      this.currAddressState = '';
      this.currAddressPin = '';
      this.currResideingDate=''; 
      this.currPhone='';
    }
  }

  backPersonaldetail(){
    
    this.setData();
    // let contactData = this.session.get('contactDetail');
    // if(this.session.get('contactDetail')){
    //   this.assignValue(contactData.contactDetail);
    // }
    this.router.navigate(['/home'], this.contactDetailData);
  }
  
  editPage() {    
    this.isReadonly = false;
  }
  
  homePage() {
    window.sessionStorage.clear();
    this.router.navigate(['/admin-user']);
  }
}
