import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import {HrDataService} from './hr-data.service';
import {ActivatedRoute} from "@angular/router";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Welcome on board',
      url: 'welcome/:email',
      icon: 'gift',
      disableItem: true
    },
    {
      title: 'Personal detail',
      url: '/home',
      icon: 'contact',
      disableItem: true
    },
    {
      title: 'Contact detail',
      url: '/contactdetail',
      icon: 'contacts',
      disableItem: true
    },
    {
      title: 'Education detail',
      url: '/educationdetail',
      icon: 'school',
      disableItem: true
    },
    {
      title: 'Experience detail',
      url: '/experiencedetail',
      icon: 'bookmarks',
      disableItem: true
    },
    {
      title: 'Upload document',
      url: '/upload-document',
      icon: 'document',
      disableItem: true
    },
    {
      title: 'Confirmation details',
      url: '/confirmationdetail',
      icon: 'checkmark-circle-outline',
      disableItem: true
    }
  ];

  usename : string;
  isHr : boolean;
  email: string;
  authUser:string;
  toastMessage: string = '';
  toastMessage1: string = '';
  toastMessage2: string = '';
  toastMessage3: string= '';
  toastMessage4: string = '';
  toastMessage5: string = '';
  perAddress:string;
  empdetailsData: any;
  id: any;
  isCandidate :  boolean = false;
  removed: any = []; 
  @Input() menuButton: boolean;
  // disableItem: false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public session: SessionStorageService,
    public router: Router,
    private data: DataService,
    private hrData: HrDataService,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.initializeApp();
    // console.log('route', route);
    // this.hrData.currentAuthUser.subscribe(user => this.authUser = user);
    // console.log(this.authUser);
    // if(this.authUser!=='authorizedUser'){
    //   this.router.navigate(['/login']);
    // }
    this.hrData.isHrFlag.subscribe(value => {
    this.isHr = value;
      console.log(this.removed, 'this.appPages.length', this.appPages.length, value);
      if(value) {
        if(this.appPages.length == 7){
          console.log('on7', this.appPages);
          this.isCandidate = true;  
          this.appPages.splice(0,1); 
        }
        if((this.appPages.length == 7) || (this.appPages.length == 6)){
          if(this.isCandidate == false){
            this.appPages.splice(0,1); 
            console.log("running hr 6", this.appPages, this.isCandidate);
          } 
          if (this.platform.is('ipad')) {   
            console.log(this.removed);   
            // if(this.appPages[0].title == 'Welcome on board')  {
            //   console.log("HR  running first ", this.appPages[0]);
            //   this.appPages.splice(0,1); 
            // }    
            // if(this.isCandidate == true ){
            //   console.log("HR  running first ", this.appPages[5]);               
            //   this.appPages.splice(5, 0, this.appPages[5]);    
            // } 
            console.log("HR  running in a browser on ipad!", this.appPages);
            this.appPages.splice(5,1);
            console.log("running hr mid", this.appPages);            
          } 
        }
      } 
      else {
        if (this.platform.is('ipad')) {
          
          console.log("running in cand", this.appPages);
          let arr = this.appPages.splice(5,1);
          if(arr)
          // this.removed.push(this.appPages.splice(5,1));
          console.log(this.removed, "running cand", this.appPages);
        } else {
          // this.isIpad = false;
          console.log(this.appPages);
        }
      }      
    });       
  }

  isActive(p){
    if(p)
    {
      document.getElementById("menuItem").style.background = "blue";
    }  
    // console.log(this.hrData.getHrFlag());
    // if((this.hrData.getHrFlag() == undefined) || (this.hrData.getHrFlag() ==false)){
    //   console.log('emp in', this.data.getDataByID())
    //   if(this.data.getDataByID()){
    //     this.data.getDataByID().subscribe(data=> {
    //       console.log('data by id', data.json());   
    //       let value= data.json();
  
    //       console.log('value[0].empDataByHR.empFName', value[0].empDataByHR.empFName)
    //       this.usename = value[0].empDataByHR.empFName;
    //     })
    //   }      
    // }
    // if(this.hrData.getHrFlag()){
    //   this.hrData.empDataSelected.subscribe(selecteddata => {     
    //     console.log('selecteddata',  selecteddata); 
    //     this.selectedHrData = JSON.parse(JSON.stringify(selecteddata));  
    //       console.log('contact data', this.selectedHrData);          
    //       this.data.currentMessage.subscribe(usename => this.usename = usename);
    //   });
    // }   
  }

  empdata: any;
  selectedHrData:any;
  menuItemClick(e, p){
    if((this.hrData.getHrFlag() == undefined) || (this.hrData.getHrFlag() ==false)){
      this.data.getDataByID().subscribe(async data=> { 
        let value= data.json();
        if(p.icon == 'gift') {
          this.router.navigate(['welcome/'+value[0].empDataByHR.empEmail]);
        }
        this.toastMessage = '';
        this.toastMessage1 = '';
        this.toastMessage2 = '';
        this.toastMessage3 = '';
        this.toastMessage4 = '';
        this.toastMessage5 = '';
        let contactData = value[0].employeeDetails.contactDetail;
        if(contactData){
          this.perAddress = contactData.permanentAddressFlatNo+ contactData.permanentAddressState+ contactData.permanentAddressArea+ contactData.permanentAddressDistrict+ contactData.permanentAddressStreet+ contactData.permanentAddressPin;
        }

        if(value[0]){
          if(this.session.get('employeeDetail')){            
            this.session.set('employeeDetail', this.session.get('employeeDetail'));
          } else
          if(value[0].employeeDetails.empPersonalData) {
            let employees = { empPersonalData: value[0].employeeDetails.empPersonalData} 
            this.session.set('employeeDetail', employees);
          }
          if(this.session.get('contactDetail')){            
            this.session.set('contactDetail', this.session.get('contactDetail'));
          } else
          if(value[0].employeeDetails.contactDetail) {
            let contactDetailData = {contactDetail: value[0].employeeDetails.contactDetail }; 
            this.session.set('contactDetail', contactDetailData); 
          }   
          if(this.session.get('educationDetails')){            
            this.session.set('educationDetails', this.session.get('educationDetails'));
          } else
          if(value[0].employeeDetails.educationDetail){
            let eduDetail = {educationDetail: value[0].employeeDetails.educationDetail};
            this.session.set('educationDetails',  eduDetail); 
          } 
          if(this.session.get('experienceDetails')){            
            this.session.set('experienceDetails', this.session.get('experienceDetails'));
          } else  
          if(value[0].employeeDetails.experienceDetail){
            let expDetail = { experienceDetail: value[0].employeeDetails.experienceDetail};
            this.session.set('experienceDetails', expDetail);
          }  
          if(this.session.get('confirmationDetail')){            
            this.session.set('confirmationDetail', this.session.get('confirmationDetail'));
          } else
          if(value[0].employeeDetails.confirmationDetail){
            let confirmationDetailData = { confirmationDetail: value[0].employeeDetails.confirmationDetail             };
            this.session.set('confirmationDetail', confirmationDetailData); 
          }   
        }
        
        //todo: implement like next
        if(value[0].employeeDetails.empPersonalData) {
          this.empdetailsData = value[0].employeeDetails.empPersonalData;
        }
        // console.log('value[0].employeeDetails.empPersonalData', (this.perAddress) , (contactData.permanentPhone), (contactData.permanentResidingSince), 
        // (contactData.emergencyMobile) || contactData.emergencyPersonName);
        // if(){
        if(((value[0].employeeDetails.empPersonalData == undefined) || (value[0].empDataByHR.empFName==null) || (value[0].employeeDetails.empPersonalData ? (this.empdetailsData.DOB==undefined || this.empdetailsData.DOB==null) : false) || (value[0].empDataByHR.empLName == null)) && 
        ((p.url == '/contactdetail')|| (p.url =='/educationdetail') || (p.url =='/experiencedetail') || (p.url ==  '/upload-document') || (p.url =='/confirmationdetail'))){
          // (!value[0].employeeDetails.empPersonalData)){
          //toast of filling mandatory field
          console.log(value[0].empDataByHR.empFName , value[0].empDataByHR.empLName);
          if (value[0].employeeDetails.empPersonalData ? (this.empdetailsData.DOB==undefined || this.empdetailsData.DOB==null) : false){        
            this.toastMessage="Date of Birth";
          }
          else if((value[0].empDataByHR.empFName==null) || value[0].empDataByHR.empFName==undefined || (value[0].empDataByHR.empLName == null)  || (value[0].empDataByHR.empLName == undefined)) {
            this.toastMessage1= "Full Name.";
          }
          p.disableItem = true;
          const alert = await this.alertController.create({
            header: 'Mandatory Fields Empty!!',
            message: 'Please fill mandatory fields'+this.toastMessage + this.toastMessage1,
            buttons: [
              {
                text: 'Okay',
                handler: () => { 
                  this.router.navigate(['/home']);
                }
              }     
            ]
          });
          await alert.present();
        // }
       } else 
        if(((this.perAddress==null) || (contactData.permanentPhone==null) || (contactData.permanentResidingSince==null) || 
        (contactData.emergencyMobile==null) || contactData.emergencyPersonName == null) && ((p.url =='/educationdetail') || (p.url =='/experiencedetail') || (p.url ==  '/upload-document') || (p.url =='/confirmationdetail'))){     
          // console.log((contactData.permanentPhone), (contactData.permanentResidingSince), 
          // (contactData.emergencyMobile==null) , contactData.emergencyPersonName );
          if ((this.perAddress==null || this.perAddress==undefined && ((p.url =='/educationdetail') || (p.url =='/experiencedetail') || (p.url ==  '/upload-document') || (p.url =='/confirmationdetail')))) {
            this.toastMessage = "\n- Permanent Address";
          } else
          // if ((contactData.emailId==null || contactData.emailId==undefined )) {
          //   this.toastMessage1 = "\n- Email Id";
          // } else
          if ((contactData.permanentPhone==null || contactData.permanentPhone==undefined)) {
            this.toastMessage2 =  "\n- Phone Number";
          } else
          if ((contactData.permanentResidingSince==null || contactData.permanentResidingSince==undefined)) {
            this.toastMessage3 = "\n- Residing Since";
          } else
          if ((contactData.emergencyMobile==null || contactData.emergencyMobile==undefined)) {
            this.toastMessage4 = "\n- Emergency Mobile Number";
          } else 
          if((contactData.emergencyPersonName == null || contactData.emergencyPersonName== undefined)){
            this.toastMessage5 = "\n- Emergency Contact Person Name";
          }
          const alert = await this.alertController.create({
            header: 'Mandatory Fields Empty!!',
            message: 'Please fill mandatory fields'+this.toastMessage + this.toastMessage1 + this.toastMessage2 + this.toastMessage3 +this.toastMessage4 + this.toastMessage5,
            buttons: [
              {
                text: 'Okay',
                handler: () => { 
                  this.router.navigate(['/contactdetail']);
                }
              },    
            ]
          });
          await alert.present();
        }else
        if((value[0].employeeDetails.educationDetail.length == 0) && ((p.url =='/experiencedetail') || (p.url ==  '/upload-document') || (p.url =='/confirmationdetail'))) {
            const alert = await this.alertController.create({
              header: 'Mandatory Fields Empty!!',
              message: 'Please fill Education detail.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => { 
                    this.router.navigate(['/educationdetail']);
                  }
                }     
              ]
            });
            await alert.present();
        }        
      })
    }
    if(this.hrData.getHrFlag()){
      this.hrData.changeIsHr(true);      
      this.hrData.empDataSelected.subscribe(selecteddata => { 
        // console.log(JSON.parse(JSON.stringify(selecteddata)));
        this.selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
        if (this.selectedHrData){
          console.log('hr data is there', this.selectedHrData)
          this.session.set('empDataByHR', this.selectedHrData.empDataByHR); 
          this.id = this.selectedHrData._id; 
          this.data.setEmpID(this.id);  
    // if(this.hrData.getHrFlag()){
    //   this.hrData.empDataSelected.subscribe(selecteddata => {  
    //     this.selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
          if(this.session.get('employeeDetail')){            
            this.session.set('employeeDetail', this.session.get('employeeDetail'));
          } else
          if(this.selectedHrData.employeeDetails.empPersonalData) {
            let employees = { empPersonalData: this.selectedHrData.employeeDetails.empPersonalData} 
            this.session.set('employeeDetail', employees);
          }
          if(this.session.get('contactDetail')){            
            this.session.set('contactDetail', this.session.get('contactDetail'));
          } else
          if(this.selectedHrData.employeeDetails.contactDetail) {
              let contactDetailData = {contactDetail: this.selectedHrData.employeeDetails.contactDetail }; 
              this.session.set('contactDetail', contactDetailData); 
            } 
          if(this.session.get('educationDetails')){            
            this.session.set('educationDetails', this.session.get('educationDetails'));
          } else 
          if(this.selectedHrData.employeeDetails.educationDetail){
            let eduDetail = {educationDetail: this.selectedHrData.employeeDetails.educationDetail};
            this.session.set('educationDetails',  eduDetail); 
          }   
          if(this.session.get('experienceDetails')){        
            this.session.set('experienceDetails', this.session.get('experienceDetails'));
          } else
          if(this.selectedHrData.employeeDetails.experienceDetail){
            let expDetail = { experienceDetail: this.selectedHrData.employeeDetails.experienceDetail};
            this.session.set('experienceDetails', expDetail);
          }  
          if(this.session.get('confirmationDetail')){            
            this.session.set('confirmationDetail', this.session.get('confirmationDetail'));
          } else
          if(this.selectedHrData.employeeDetails.confirmationDetail){
            let confirmationDetailData = { confirmationDetail: this.selectedHrData.employeeDetails.confirmationDetail             };
            this.session.set('confirmationDetail', confirmationDetailData); 
          }   
        }
      });
    }
  }
  
  getEmpdataById(email: string) {
    this.data.getLoginData(email).subscribe(data => {
      let jsonData =  data.json();
    });
  }

  menuChange(e){
  }

  showMenuClick(event, p) {  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to Logout.',
      buttons: [
        {
          text: 'Okay',
          handler: () => { 
            window.sessionStorage.clear();
            this.hrData.setReadFlag(false);    
            localStorage.setItem('authUser', 'noUser'); 
            window.localStorage.clear();    
            this.hrData.setHrFlag(false);
            this.router.navigate(['/login']);
          }
        },
        {
          text: 'Cancel',
          handler: () => {}
        }

      ]
    });
    await alert.present();
  }
}
