import { Component, OnInit, Inject } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute, Router } from '@angular/router';
import { HrDataService } from '../hr-data.service';
import { DataService } from '../data.service';
import { AlertController } from '@ionic/angular';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AdvanceSearchPage} from './advance-search/advance-search.page';
import { SessionStorageService } from 'angular-web-storage';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

type AOA = any[][];
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.page.html',
  styleUrls: ['./admin-user.page.scss'],
})
export class AdminUserPage implements OnInit {
  public loading = false;
  adminEmpData: any[];
  searchTerm: any="";
  emplocation: string;
  sortStatus: string;
  sortedCollection: any[];
  order: string = 'employeeDetails.status';
  reverse: boolean = false;
  viewFlag: boolean = false;
  hrFlag: boolean = true;
  alldata: any;  
  searchDataCopy: any[];
  backupData;
  mailData : any;
  mailSubject: any;
  noData: boolean = false;
  disableIcon: boolean = false;
  authUser: string;
 
  constructor(private orderPipe: OrderPipe, private route: ActivatedRoute, private toastCtrl: ToastController, private alertController: AlertController, public router: Router, private hrData: HrDataService, private empData: DataService, public dialog: MatDialog, public session: SessionStorageService) {
   this.hrData.currentAuthUser.subscribe(user => this.authUser = user);   
   if(this.authUser=='authorizedUser' || (localStorage.getItem('authUser') =='authorizedUser')){
    window.sessionStorage.clear();
      this.setData();
      this.mailData = '';
      this.mailSubject = "Details required"; 
      this.empData.getEmployeedata().subscribe(data => {
        this.searchDataCopy = this.alldata;
        this.empData.getDataStatus();
        if(this.alldata) {
          this.alldata.map(data => { 
            console.log(data);
            this.checkGender(data);
            this.changeStatusColor(data);
          });  
        } 
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.alldata = this.alldata + this.session.get('empDataByHR');
    console.log(this.alldata);
  }

  viewEmpDetail(data){
    this.viewFlag = true;
    this.hrData.setSelectedData(data);
    this.hrData.setHrFlag(this.hrFlag);
    this.hrData.setReadFlag(this.viewFlag);
    this.router.navigate(['/home']);
    //todo: put this in home page
    this.empData.setDataStatus('In Progress');
  }  
   
  editEmpDetail(data){
    this.viewFlag = false;
    console.log(data);
    // this.empdata.setEmpID(data._id); 
    this.hrData.setSelectedData(data);
    this.hrData.setHrFlag(this.hrFlag);
    this.hrData.setReadFlag(this.viewFlag);    
    this.router.navigate(['/home']);
  }

  printEmpDetail(data){
    this.loading = true;
    //check subscribe
    this.hrData.generatePDF(data).then(val => {
      console.log('genprintAdmin', val);
      new Promise(resolve => {
        // if(val == true){
          setTimeout(() => {
          console.log('loading done', this.loading);
          this.loading = false;
          },5000);
        // }
        })
      });
      // setTimeout(() => {
      // console.log('loading done', this.loading);
      // this.loading = false;
      // },5000);
      // iframe.contentWindow.close
    
    // window.onafterprint = function(){
    //   console.log("Printing completed...");
    // }
    // loadingProgress
    // this.hrData.generatePDF(data).then((data)=>console.log('promisedata'));
  }

  async deleteEmpDetail(data){
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure you want to delete the record.',
      buttons: [
        {
          text: 'Okay',
          handler: () => {           
            let index = this.alldata.indexOf(data);
            this.alldata.splice(index,1);
            this.hrData.deleteRecord(data._id).subscribe(
              data => {        
              },
              async error => {
                console.log('oops', error);
                const toast = await this.toastCtrl.create({
                  message: 'Error: Delete failed. Please try after sometime.',
                  color: 'primary',
                  showCloseButton: true,
                  position: 'top',
                  cssClass: "className",
                  duration: 2000
                });
                toast.present(); 
              }
            );
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Cancel');     
          }
        }

      ]
    });
    await alert.present();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  customComparator(itemA, itemB) {
    return itemA > itemB ? 1 : -1;
  }  

  statusChange(status) {
    if(status !== undefined) {
      this.hrData.statusSearch(status).subscribe(data => {
        this.alldata = data.json();
        this.searchDataCopy = this.alldata;
        this.alldata.map(data => {   
          this.checkGender(data);
          this.changeStatusColor(data);
        });    
      });       
      console.log(this.alldata ); 
    }   
      
    if (this.sortStatus !== undefined){            
      this.emplocation = undefined;
    }    
  }

  //TODO: sort
  onChangelocation(selectedValue){
    this.order = 'selectedValue';
    if(selectedValue !== undefined){
      this.hrData.advanceSearch(selectedValue || null ,  null, null , null).subscribe(
        searchdata => {        
          this.alldata = searchdata.json();  
          this.searchDataCopy = this.alldata;         
          this.alldata.map(data => { 
            this.checkGender(data);   
            this.changeStatusColor(data);
          });    
        },
        async error =>{ console.log('oops', error);
          const toast = await this.toastCtrl.create({
            message: 'Error: Search by location failed. Please try after sometime.',
            color: 'primary',
            showCloseButton: true,
            position: 'top',
            cssClass: "className",
            duration: 2000
          });
          toast.present(); 
        }        
      );
    }    
    if(this.emplocation !== undefined) {     
      this.sortStatus = undefined;
    }        
  }

  async downCetrtificate(data){
    this.loading = true;
    const alert = await this.alertController.create({
      header: 'Download',
      message: 'Do you want to download the record.',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay', data);  
            new Promise(resolve => {
            this.hrData.downloadZip(data._id);
            resolve(true);
            }).then(val => 
              {console.log(val);
                this.loading = false;
              });
            // .then(value => {
            //   console.log(value);
            //   if(value == true){
            //     this.loading = false;
            //   }
            // });
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Cancel');  
            this.loading = false;   
          }
        }

      ]
    });
    await alert.present();
    //TODO: check dismis
    await alert.onDidDismiss().then((val) => {
      console.log('alert dismis', val.role);  
      if( val.role =="backdrop"){        
        this.loading = false;   
      }     
    });
      // new Promise(resolve => {})
      //Your code here
    // )
    // if (alert && !alert._detached) { this.services.alert.dismiss(); }
    // self.dismiss(animated: false, completion: nil)
    // if(alert.dismiss()){
    //   this.loading = false;  
    //   console.log('The alert has been closed.', alert.dismiss())
    // };
  }

  addEmp() {
    this.hrData.setSelectedData(null);
    this.router.navigate(['/add-employee']);
  }

  // Upload and read excel 
  data: AOA = [ ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  backUpExcelData;
  status: string;
  id: string;
  empdata: any;
  toastMessage: string;
  toastMessage1: string;
  toastMessage2: string;
  toastMessage3: string;
  toastMessage4: string;
  async BindDataToGrid(data){
    //  new Promise((resolve,reject)=> {
      this.status = 'New';
      let date = moment(new Date()).format('DD-MM-YYYY_HH.mm.ss.SSS');
      this.backUpExcelData = JSON.parse(JSON.stringify(data));
      let dataLen = data.length;
      for(let s =1; s < dataLen; s++){
        let empFName = "";
        let workLocation = "";
        let empLName = "";
        let  emailId = "";
        let DOJ = "";
        empFName = this.backUpExcelData[s][0];
        empLName= this.backUpExcelData[s][2];                      
        emailId = this.backUpExcelData[s][3];
        this.id= empFName+empLName+'_'+date;
        if(empFName=='' || empFName==undefined || empLName=='' || empLName == undefined || DOJ == null 
        || emailId == '' || emailId == undefined ||  this.backUpExcelData[s][8] == null || this.backUpExcelData[s][8] == undefined) {  
      
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
      if ((emailId=='' || emailId==undefined )) {
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
    }else {    
      let empEmailId = CryptoJS.AES.encrypt(emailId.trim(), empFName.trim()).toString().split('/').join('sA1H').split('+').join('aD3p').split('=').join('Eq2l');      
      let DOJFormate = moment(this.backUpExcelData[s][4]).format('YYYY-MM-DD');
          this.empdata = {      
            "empFName": this.backUpExcelData[s][0] ? this.backUpExcelData[s][0] : '',
            "empMName": this.backUpExcelData[s][1] || '',
            "empLName": this.backUpExcelData[s][2] || '',
            "empEmail": empEmailId || '',
            "DOJ": DOJFormate || null,
            "department": this.backUpExcelData[s][5] || null,
            "designation": this.backUpExcelData[s][6] || '',
            "buddyName": this.backUpExcelData[s][7] || '',
            "workLocation": this.backUpExcelData[s][8] || null
          };
          this.session.set('empDataByHR', this.empdata);   
          this.empData.setDataStatus(this.status);    
          this.empData.setEmployeedata(this.status, this.id);
        }
      }
  }

  loadExcelFile(evt: any){
    // return new Promise((resolve,reject)=> {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length != 1) throw new Error('Cannot use multiple files');
    
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
      this.BindDataToGrid(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
    // resolve(this.data);
    // });
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    console.log('export');
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
  //end Upload

  saveExcel() { }

  getItems(ev) {
    // Reset items back to all of the items
    this.resetSearch();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.alldata = this.alldata.filter((item) => {
        return ((item.empDataByHR.empFName.toLowerCase().indexOf(val.toLowerCase()) > -1) 
        || (item.empDataByHR.empMName.toLowerCase().indexOf(val.toLowerCase()) > -1) 
        || (item.empDataByHR.empLName.toLowerCase().indexOf(val.toLowerCase()) > -1) 
        || (item.empDataByHR.workLocation ? item.empDataByHR.workLocation.toLowerCase().indexOf(val.toLowerCase()) > -1 : '')
        || (item.status.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  }

  resetSearch() {
    this.alldata = this.searchDataCopy;
  }

  setData = () => {    
    this.hrData.getDataByDOJ().subscribe(data => {
      this.alldata = data.json();
      if (this.alldata.length == 0) {
        this.noData = true;
      }   
      this.searchDataCopy = this.alldata;
      this.sortedCollection = this.orderPipe.transform(this.alldata, this.order);
      this.empData.getDataStatus();
      this.alldata.map(data => {  
        this.checkGender(data); 
        this.changeStatusColor(data);
      });    
      
    });
  };
  
  searchDOJ : Date; 
  searchLocation: string;
  DOJFrom: Date;
  DOJTo: Date;
  searchResult : any;
  advanceSearch(search): void {
    const dialogRef = this.dialog.open(AdvanceSearchPage, {
      width: '70%',
      data: {searchResult: this.searchResult, searchDOJ: this.searchDOJ, searchLocation: this.searchLocation, DOJFrom: this.DOJFrom, DOJTo: this.DOJTo} //data here from search
    });
    
    this.loading = true;
    dialogRef.afterClosed().subscribe(async result => {
      console.log('result', result);
      if(result !== undefined){
        this.alldata = result;   
        console.log(this.alldata,'this.loading', this.loading)   ;    
        this.alldata.map(data => {   
          this.checkGender(data);
          this.changeStatusColor(data);
        })
        this.loading = false;             
      }else{
        this.loading = false; 
      }
      this.searchDataCopy = this.alldata;   
    });
  }

  changeStatusColor(data){
    //Disable print and view icon
    if(data.status == 'Completed' && (data.employeeDetails.experienceDetail || data.employeeDetails.empPersonalData)){
      data.disableIcon =true;
    } else {
      data.disableIcon =false;
    }             
    //TODO: if status add color
    if (data.status == 'New'){
      data.color = "secondary";
    } else if(data.status == 'Completed'){
      data.color = "success";
    } else if(data.status == 'Inprogress'){
      data.color = "warning";
    }
  }

  checkGender(data){
    data.gender= false;
    if(data.employeeDetails.empPersonalData){
      if(data.employeeDetails.empPersonalData.sex == 'female'){
        data.gender= true;
        console.log(data);
      } else if((data.employeeDetails.empPersonalData.sex == 'male') || (data.employeeDetails.empPersonalData.sex == "")){
        data.gender= false;
        console.log(data.gender);
      }
    }
  }
  editHrEmpDetail(data) {
    this.viewFlag = false;
    this.hrData.setSelectedData(data);
    this.hrData.setHrFlag(this.hrFlag);
    this.hrData.setReadFlag(this.viewFlag); 
    this.router.navigate(['/add-employee']);
  }

  downloadExcelSample(){
    console.log('download')
    window.open('/assets/SampleExcelToEmployeeUpload.xlsx');
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to Logout.',
      buttons: [
        {
          text: 'Okay',
          handler: () => { 
            this.session.clear(); 
            this.hrData.setReadFlag(false);
            this.hrData.setHrFlag(false);
            localStorage.setItem('authUser', 'noUser'); 
            // window.localStorage.clear();  
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
