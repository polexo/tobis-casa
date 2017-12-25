import { MapPage } from './../pages/map/map';

import { ModalPage } from './../pages/modal/modal';

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { MomentModule } from 'angular2-moment';

import { FavPage } from '../pages/favs/favs';
import { HomePage } from '../pages/home/home';
import { HelpPage } from './../pages/help/help';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    MyApp,
    FavPage,
    HomePage,
    TabsPage,
    HelpPage,
    ModalPage, 
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FavPage,
    HomePage,
    TabsPage,
    HelpPage,
    ModalPage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
