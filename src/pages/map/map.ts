import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as gm from '@ionic-native/google-maps';
/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {


  constructor(public navCtrl: NavController, private googleMaps: gm.GoogleMaps) { }

  // Load map only after view is initialized
  ionViewDidLoad() {
    this.loadMap();
  }
  loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');
    let mapOptions: gm.GoogleMapOptions = <gm.GoogleMapOptions>({
      mapType: 'MAP_TYPE_NORMAL',
      controls: {
        compass: true,
        myLocationButton: true,
        indoorPicker: true,
        mapToolbar: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        zoom: true,
        rotate: true,
      },
      camera: {
        target: {
          lat: 33.563677,
          lng: -7.589216
        },
        zoom: 16,
        tilt: 30
      }
    });

    let map: gm.GoogleMap = this.googleMaps.create(element, mapOptions);
    //let map: gm.GoogleMap = new gm.GoogleMap(element, mapOptions);
    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.on(gm.GoogleMapsEvent.MAP_READY).subscribe(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      }
    );

  }

}
