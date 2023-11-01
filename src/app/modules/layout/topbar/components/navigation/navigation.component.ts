import { Component } from '@angular/core';
import { Emoji } from '../../../../../models/emoji';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  Emoji = Emoji;

  constructor(public activeModal: NgbActiveModal) {}

  routeTiles = [
    { label: 'Dashboard', filename: 'dashboard', route: '/dashboard' },
    { label: 'Places', filename: 'restaurant', route: '/places-overview' },
    { label: 'Food', filename: 'food', route: '/food-overview' }
  ];
}
