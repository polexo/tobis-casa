import { HomePage } from './../home/home';
import { PlaceModel } from './../model/place.model';
import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-favs',
  templateUrl: 'favs.html'
})
export class FavPage {
  favs = [];
  tabs: Tabs;
  constructor(public navCtrl: NavController, public storage: Storage) {
    this.tabs = this.navCtrl.parent;
  }
  ionViewDidEnter() {
    this.favs = [];
    this.storage.forEach((val, key) => {

      if (key.startsWith("fav")) {
        let departure = new PlaceModel();
        let arrival = new PlaceModel();
        let entries = JSON.parse(val);

        Object.assign(departure, entries.departure);
        Object.assign(arrival, entries.arrival);

        this.favs.push({ departure: departure, arrival: arrival, id: key });
      }
    });

  }
  deleteFav(id) {
    this.storage.remove(id);
    this.favs = this.favs.filter(obj => obj.id !== id);

  }
  useFav(fav) {
    this.navCtrl.push(HomePage, { usedFav: fav });
  }
}
