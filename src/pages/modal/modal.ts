import { PlaceModel, PlaceModelTypes } from './../model/place.model';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams, AlertController, Platform } from 'ionic-angular';
@Component({
  selector: "page-modal",
  templateUrl: 'modal.html'
})

export class ModalPage {

  autocompleteItems: any;
  autocomplete: any;
  service = new google.maps.places.AutocompleteService();
  title: string;
  choosenItem: PlaceModel;
  isValidChoice: boolean;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('btnValidate') btnValidateElement;
  map: any;
  choosenMarker: google.maps.Marker;
  enableGeoLoc: boolean;
  constructor(public viewCtrl: ViewController, private zone: NgZone, params: NavParams, public alertCtrl: AlertController
    , public platform:Platform) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.title = params.get("title");
    this.enableGeoLoc = params.get("enableGeoLoc");
    this.isValidChoice = false;

    this.choosenItem = new PlaceModel()
     platform.ready().then(() => {
            this.loadMap();
        });
  }

  dismiss() {
    this.viewCtrl.dismiss(this.choosenItem);
  }

  chooseItem(item: PlaceModel) {
    Object.assign(this.choosenItem, item);
    this.dismiss();
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: { country: 'MA' }
    },
      function (predictions, status) {
        me.autocompleteItems = [];
        me.zone.run(function () {
          if (predictions !== null) {
            predictions.forEach(function (prediction) {
              if ( prediction.description.toLowerCase().indexOf('casablanca') > 0) {
                let item = <PlaceModel>(
                  {
                    desc: prediction.description,
                    coords: { lat: "", lng: "" },
                    type: PlaceModelTypes.placeType
                  });
                me.autocompleteItems.push(item);
              }
            });
          }
        });
      });
  }
  ionViewDidLoad() {
    //this.loadMap();
  }
  /*Map */
  loadMap() {


    let latLng = new google.maps.LatLng(33.589886, -7.603869);

    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.choosenMarker = new google.maps.Marker({

      position: this.map.getCenter(),
      map: this.map
    });
    let that = this;
    google.maps.event.addListener(this.map, 'click', function (event) {
      Object.assign(that.choosenItem, {
        desc: "Lieu choisi sur la carte",
        coords: { lat: event.latLng.lat() + "", lng: event.latLng.lng() + "" },
        type: PlaceModelTypes.mapType
      });
      that.ValidateChoice();

      that.choosenMarker.setPosition(event.latLng);
    });

    that.ValidateChoice();

  }
  LocalizeUser() {

    navigator.geolocation.getCurrentPosition(pos => {
      Object.assign(this.choosenItem, {
        desc: "postion courrante",
        coords: {
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString()
        },
        type: PlaceModelTypes.geoType
      });
      var mPos = new google.maps.LatLng(pos.coords.latitude,
        pos.coords.longitude);
      this.choosenMarker.setPosition(mPos);
      this.map.setCenter(mPos);
      this.ValidateChoice();
    }, () => {
      console.log("err");

    });
  }
  ValidateChoice() {
    this.isValidChoice = this.choosenItem.isValid();
  }
  showHelp() {
    let alert = this.alertCtrl.create({
      title: 'Aide!',
      subTitle: '',
      buttons: ['OK']
    });
    alert.present();
  }
}


