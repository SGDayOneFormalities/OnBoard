import {  Component,
  OnInit, Directive,
  AfterViewInit,
  ViewChild, ElementRef,
  Output, Input,
  EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
// import { FileUploader } from 'ng2-file-upload';
import { DataService } from '../data.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FileSelectDirective, FileDropDirective, FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import {HrDataService} from '../hr-data.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.page.html',
  styleUrls: ['./upload-document.page.scss'],
})
@Directive({ selector: '[ng2FileSelect]' })
@Directive({ selector: '[ng2FileDrop]' })

export class UploadDocumentPage implements OnInit {
  filename: any =[];
  fileupload: any;
  uploadProgress: any;
  upstatus: boolean;
  uploader:FileUploader;
  errorMessage: string;
  allowedMimeType = ['application/x-zip-compressed','application/x-compressed', 'application/x-zip-compressed', 'application/zip', 'multipart/x-zip'];
  maxFileSize = 25 * 1024 * 1024; //25MB
  public loading = false;
  id: string;
  fileResponse: boolean;
  isHrFlag:boolean;
  isIpad :  boolean = false;

  constructor(public plt: Platform, public router: Router, private empdata: DataService, private toastCtrl: ToastController, public alertController: AlertController,public hrData: HrDataService){
    this.hrData.isHrFlag.subscribe(flag => {this.isHrFlag = flag}); 
    if (this.plt.is('ipad')) {
      this.isIpad = true;
        console.log("running in a browser on ipad!");
    } else {
      this.isIpad = false;
    }
    console.log('this.hrData.getHrFlag()',this.hrData.getHrFlag());
    if(this.hrData.getHrFlag()){
      this.hrData.empDataSelected.subscribe(selecteddata => { 
        console.log('selecteddata', selecteddata); 
        let selectedHrData = JSON.parse(JSON.stringify(selecteddata)); 
        console.log('selectedHrData', selectedHrData);
        if(selectedHrData){
          this.id = selectedHrData._id;  
          this.empdata.readUploadData(this.id).subscribe(data => {
            
          console.log(data.text());
            if(data.text()) {
              data.json().forEach(element => {
                console.log(element);
                if(element.match(/.zip/g) == ".zip" || element.match(/.ZIP/g) == ".ZIP"){
                  this.filename.push(element);
                }
              }); 
            }
          });
        }
      })
    }else {
      this.empdata.getDataByID().subscribe(data=> {
        let empLoginData= data.json();          
        this.id = empLoginData[0]._id;    
        this.empdata.readUploadData(this.id).subscribe(data => {
          console.log(data);
          if(data.text()) {
            data.json().forEach(element => {
              if(element.match(/.zip/g) == ".zip" || element.match(/.ZIP/g) == ".ZIP"){
                this.filename.push(element);
              }
            }); 
          }
        });
      })    
    }
    
    this.uploader = new FileUploader({
      url: this.empdata.getEmpID('false'),
      allowedMimeType: this.allowedMimeType,
      headers: [{name:'Accept', value:'application/json'}],
      autoUpload: true,
      maxFileSize: this.maxFileSize,
    });
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let data = JSON.parse(response); //success server response
    if(response == "File is uploaded")
    this.fileResponse =true;
    console.log('sucess', response);
  }

  async onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
      // let error = JSON.parse(response); //error server response
      this.fileResponse =false;
      console.log('error', response);
      const toast = await this.toastCtrl.create({
        message: 'Error: Upload failed. Please try after sometime.',
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        cssClass: "className",
        duration: 2000
      });
      toast.present(); 
  }
  countFile: any = 0;
  onWhenAddingFileFailed(item, filter: any, options: any) {
    console.log(item,'this.countFile',  this.countFile);
   
    if(this.countFile < 1) {
      this.countFile = this.countFile+ 1;
      switch (filter.name) {
          case 'fileSize':
              this.errorMessage = `Maximum upload size(1.5MB) exceeded. `;
              this.uploadInfo(this.errorMessage);
              this.loading = false;
              break;
          case 'mimeType':
              const allowedTypes = this.allowedMimeType.join();
              this.errorMessage = `This file type is not allowed. Please add Zip file.`;
              this.uploadInfo(this.errorMessage);
              this.loading = false;
              break;
          default:
              this.errorMessage = `Unknown error (filter is ${filter.name})`;
              this.uploadInfo(this.errorMessage);
              this.loading = false;
              break;
      }
    }else {
      console.log('more');
    }
  }
    
  ngOnInit() { 
  }

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  public fileOverAnother(e:any, uploader):void {  
    this.hasAnotherDropZoneOver = e;
  }

  //on Drag file
  public fileOverBase(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  public onFileDrop(fileList: File[], e:any) {
    console.log(e);
    if(fileList.length > 1){      
      console.log(fileList);// u get file as fileList[0]
      this.uploadInfo('Please Add only 1 Zip file');
      
    }
  }

  nextConfirmation() {    
    this.loading = true; 
    this.uploader.uploadAll();   
    this.empdata.readUploadData(this.id);
    if((this.uploader.queue.length == 0) && (this.filename.length==0) && (this.isIpad == false)){
      this.uploadInfo('Please Upload the Certificates');
    }else{     
      if(this.uploader.progress == 100){
        this.router.navigate(['/confirmationdetail']).then(() => this.loading = false);          
      } 
      else{
        this.uploader.uploadAll();        
          this.router.navigate(['/confirmationdetail']);        
      } 
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

  async removeFileitem(item) {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Are you sure you want to delete the record.',
      buttons: [
        {
          text: 'Okay',
          handler: () => {    
              let index = this.uploader.queue.indexOf(item);
              console.log(index);
              this.uploader.queue.splice(index,1);
              console.log('this.id, file', this.id, item.file.name);
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
  
  async removeFile(fileSelected) {
    const alert = await this.alertController.create({
      header: 'Info!',
      message: 'Are you sure you want to delete the record.',
      buttons: [
        {
          text: 'Okay',
          handler: () => {  
            if(this.filename){   
              let index = this.filename.indexOf(fileSelected);
              this.filename.splice(index,1);
              this.empdata.deleteUpload(this.id, fileSelected).subscribe(
                data => {},
                error => console.log('oops', error)  
              );
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

  homePage() {
    window.sessionStorage.clear();
    this.router.navigate(['/admin-user']);
  }
 // ToDo: timer code to remove later
  timeLeft: number = 0;
  interval;

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft < 600) {
        this.timeLeft++;
      } else {
        this.timeLeft = 0;
      }
    },1000)
  }
  pauseTimer() {
    clearInterval(this.interval);
  }  
  //End timer
  
  fileuploadsingle(fileToUpload){
  }
}
