import { NgModule } from '@angular/core';
import { ActivatedRoute ,Routes, RouterModule, Router, RouteConfigLoadStart } from '@angular/router';
import {HrDataService} from './hr-data.service';
import 'rxjs/add/operator/filter';

import { filter } from 'rxjs/operators';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'add',
    loadChildren: './add/add.module#AddPageModule'
  },
  { 
    path: 'add-employee', 
    loadChildren: './add-employee/add-employee.module#AddEmployeePageModule'
  },
  {
    path: 'details', 
    loadChildren: './details/details.module#DetailsPageModule' 
  },
  { 
    path: 'login', 
    loadChildren: './login/login.module#LoginPageModule' 
  },
  { 
    path: 'welcome/:email', 
    loadChildren: './welcome/welcome.module#WelcomePageModule' 
  },
  { 
    path: 'contactdetail', 
    loadChildren: './contactdetail/contactdetail.module#ContactdetailPageModule'
  },
  { 
    path: 'educationdetail', 
    loadChildren: './educationdetail/educationdetail.module#EducationdetailPageModule'
  },
  { 
    path: 'experiencedetail', 
    loadChildren: './experiencedetail/experiencedetail.module#ExperiencedetailPageModule' 
  },
  { 
    path: 'confirmationdetail', 
    loadChildren: './confirmationdetail/confirmationdetail.module#ConfirmationdetailPageModule' 
  },
  {
    path: 'upload-document', 
    loadChildren: './upload-document/upload-document.module#UploadDocumentPageModule' 
  },
  { path: 'admin-user', loadChildren: './admin-user/admin-user.module#AdminUserPageModule' },
  { path: 'advance-search', loadChildren: './admin-user/advance-search/advance-search.module#AdvanceSearchPageModule' },
  { path: 'map', loadChildren: './welcome/map/map.module#MapPageModule' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: location.search.startsWith( "?always" )
                        ? "always"
                        : "emptyOnly"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  authUser:string;
  constructor(private hrSerData: HrDataService,private router: Router,private activatedRoute : ActivatedRoute) { 
  // if(this.router. ){
  //   path: 'welcome/:email'
  // }
    this.activatedRoute.url.subscribe(url =>{
    });
    router.events.pipe(
      filter(event => event instanceof RouteConfigLoadStart)  
    ).subscribe((event: RouteConfigLoadStart) => {
      setTimeout(() => {      
      if((event.route.path == "welcome/:email") || (this.authUser!=='authorizedUser')|| (localStorage.getItem('authUser') !=='authorizedUser')){  
        if(event.route.path == "welcome/:email"){          
        this.hrSerData.changeAuthUser('authorizedUser');
        }
        
        this.hrSerData.currentAuthUser.subscribe(user => this.authUser = user);
        if((this.authUser!=='authorizedUser') && (localStorage.getItem('authUser') !=='authorizedUser')){
          this.router.navigate(['/login']);
        }
      }
    },500);
    });

  }
  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        // example: NavigationStart, RoutesRecognized, NavigationEnd
      });
  }
}
