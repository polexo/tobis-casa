
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
var jsonQuery = require('json-query');

import { PlaceModel, PlaceModelTypes } from './../model/place.model';
import { ModalPage } from './../modal/modal';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchQuery: string = '';
  items: string[];
  arrival: PlaceModel;
  departure: PlaceModel;
  timeOption: string;
  directionsService: any;
  departureDate: string;
  arrivalDate: string;
  buses: any;
  tabBarElement: any;
  splash = true;
  results: google.maps.DirectionsLeg;
  resultShown = false;
  detailsShown = false;
  isFav = false;
  walks: any;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    public storage: Storage, public params: NavParams) {
    let usedFav = params.get('usedFav');
    if (usedFav) {
      this.arrival = usedFav.arrival;
      this.departure = usedFav.departure;
      this.isFav = true;
      console.log(usedFav);

    }
    else {

      this.arrival = new PlaceModel();
      this.departure = new PlaceModel();
    }
    let now = new Date().toISOString();
    this.departureDate = now;
    this.arrivalDate = now;
    this.timeOption = "";
    this.tabBarElement = document.querySelector('.tabbar');
    this.directionsService = new google.maps.DirectionsService;
  }
  ionViewDidLoad() {
    //this.showSplashScreen();
  }
  showSplashScreen() {
    this.storage.get('introShown').then((result) => {
      if (!result) {
        this.tabBarElement.style.display = 'none';
        setTimeout(() => {
          this.splash = false;
          this.tabBarElement.style.display = 'flex';
        }, 4000);
        this.storage.set('introShown', true);
      }
      else {
        this.splash = false;
      }
    });
  }
  getFavs() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000, spinner: "ios-small"
    });
    loader.present();
  }
  showDepartureModal() {
    let modal = this.modalCtrl.create(ModalPage, { title: "Départ", enableGeoLoc: true });
    modal.onDidDismiss(data => {
      Object.assign(this.departure, data);
    });
    modal.present();
  }
  showArrivalModal() {
    let modal = this.modalCtrl.create(ModalPage, { title: "Arrivée" });
    modal.onDidDismiss(data => {
      Object.assign(this.arrival, data);
    });
    modal.present();
  }
  /*

  */
  isValidForm() {
    let isValid = this.departure.isValid() && this.arrival.isValid();
    return isValid;
  }
  search() {
    let dirRequest = <google.maps.DirectionsRequest>(
      {
        origin: this.departure.toRequestEntry(),
        destination: this.arrival.toRequestEntry(),
        travelMode: google.maps.TravelMode.TRANSIT,
        region: "MA",
        transitOptions: this.getTransitOptions()

      }
    );

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      spinner: "ios-small"
    });
    loader.present();

    this.directionsService.route(dirRequest, (response, status) => {
      this.resultShown = true;
      this.results = response.routes[0].legs[0];
      this.buses = jsonQuery('steps[*travel_mode=TRANSIT].transit.line.short_name', {
        data: this.results
      }).value;

      let walksInSeconds = jsonQuery('steps[*travel_mode=WALKING].duration.value', {
        data: this.results
      }).value.reduce(function (a, b) { return a + b; }, 0);
      this.walks = "~" + Math.floor(walksInSeconds / 60) + "minute(s)";
      Object.assign(this.departure, {
        desc: this.results.start_address,
        type: PlaceModelTypes.mapType,
        coords: {
          lat: this.results.start_location.lat() + "",
          lng: this.results.start_location.lng() + ""

        }
      });
      Object.assign(this.arrival, {
        desc: this.results.end_address,
        type: PlaceModelTypes.mapType,
        coords: {
          lat: this.results.end_location.lat() + "",
          lng: this.results.end_location.lng() + ""

        }
      });
      loader.dismiss();
    });

  }
  getTransitOptions(): google.maps.TransitOptions {
    let opts = <google.maps.TransitOptions>({ modes: [google.maps.TransitMode.BUS, google.maps.TransitMode.TRAM] });

    switch (this.timeOption) {
      case "before":
        opts.arrivalTime = new Date(this.arrivalDate);
        break;
      case "after":
        opts.departureTime = new Date(this.departureDate);
        break;
      default:
        opts.departureTime = new Date();
        break;
    }
    return opts;
  }
  setFav() {
    var fav = {
      departure: { ...this.departure },
      arrival: { ...this.arrival }
    };
    this.storage.set('fav-' + Date.now(), JSON.stringify(fav));

  }
  showHideDetails()
  {
    this.detailsShown = !this.detailsShown;
  }
}
