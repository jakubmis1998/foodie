import { Component } from '@angular/core';
import { Emoji } from '../../../../../models/emoji';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  Emoji = Emoji;

  routeTiles = [
    { label: 'Dashboard', filename: 'dashboard', route: '/dashboard' },
    { label: 'Places', filename: 'restaurant', route: '/places-overview' },
    { label: 'Food', filename: 'food', route: '/food-overview' }
  ];
}
