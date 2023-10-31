import { Routes } from '@angular/router';
import { PlacesOverviewComponent } from './places-overview.component';

export const placesOverviewRoutes: Routes = [
  {
    path: '',
    component: PlacesOverviewComponent,
    children: []
  }
];
