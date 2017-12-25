import { MapPage } from './../map/map';

import { Component } from '@angular/core';

import { FavPage } from '../favs/favs';
import { HomePage } from '../home/home';
import { HelpPage } from './../help/help';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FavPage;
  tab3Root = HelpPage;
  tab4Root = MapPage;

  constructor() {

  }
}
