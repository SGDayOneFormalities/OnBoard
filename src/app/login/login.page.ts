import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastController } from '@ionic/angular';
import {HrDataService} from '../hr-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {  
  public loading = false;
  message:string;
  toastMessage: string = '';
  toastMessage1: string = '';
  rememberMe: string;
  username: string;
  password: string;

  constructor(public router: Router, private data: DataService, private toastCtrl: ToastController, private hrData: HrDataService, public menuCtrl: MenuController) { 
    if (localStorage.getItem('rememberMe') == 'true'){
      this.username = localStorage.getItem('username');
      this.password = localStorage.getItem('password');
      this.rememberMe = localStorage.getItem('rememberMe');
    }else {
      this.username = '';
      this.password = '';
    }
    window.sessionStorage.clear();
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  } 
  ngOnInit() {
  }

  async login(username, password){   
    this.loading = true;   
    //Validation for login
    if((username=='') || (password=='') || (username==undefined) || (password==undefined)){          
      if (username=='' || username==undefined) {
        this.toastMessage = " User name";
      } 
      if (password=='' || password==undefined) {
        this.toastMessage1 = " Password";
      } 
      // Toast for validation
      const toast = await this.toastCtrl.create({
        message: 'Please fill your'+ this.toastMessage + this.toastMessage1 + ' to login',
        color: 'primary',
        showCloseButton: true,
        position: 'top',
        duration: 2000
      });
      toast.present().then(()=> {this.loading = false; });
    }
    else{      
      console.log(username, password);
      this.hrData.loginToAdmin(username, password).subscribe(
        async data => {      
          this.loading = false;
          console.log(data.text())
          console.log('data', data.json());          
          if(data.json() == false){
            console.log('not valide');
            // Toast for validation
            const toast = await this.toastCtrl.create({
              message: 'Invalid credentials. Please try again.',
              color: 'primary',
              showCloseButton: true,
              position: 'top',
              duration: 2000
            });
            toast.present();      
          }else if(data.json() == true){
            this.hrData.changeAuthUser('authorizedUser');  
            this.router.navigate(['/admin-user']);
          }
        }, 
        error =>{
          this.loading = false;
          console.log('error', error);

        }
      );
    }
    
    console.log('remMe' + this.rememberMe);
    if(this.rememberMe){
      console.log('Inside remember Me');
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('rememberMe', JSON.stringify(this.rememberMe));
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('rememberMe');
    }
    // Setting user name in service
    this.data.changeMessage(username)
  }
}
