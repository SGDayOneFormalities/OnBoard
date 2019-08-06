import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularWebStorageModule } from 'angular-web-storage';
import { HttpModule } from '@angular/http';
import { HrDataService } from './hr-data.service';
import { AdvanceSearchPage } from './admin-user/advance-search/advance-search.page';
import { MapPage } from './welcome/map/map.page';

// import {AlertService} from './alert.service';
@NgModule({
  declarations: [ AppComponent, AdvanceSearchPage, MapPage
    // PipeComponent
  ],
  entryComponents: [AdvanceSearchPage, MapPage],
  imports: [
    // NgxPrintModule,
    MatDialogModule,
    MatDatepickerModule,
    AngularWebStorageModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
    // ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  exports:[
    MatDatepickerModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatFormFieldModule
  ],
  providers: [
    DataService,
    HrDataService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
