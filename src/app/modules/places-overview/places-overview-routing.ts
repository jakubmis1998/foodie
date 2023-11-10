import { Routes } from '@angular/router';
import { PlacesOverviewComponent } from './places-overview.component';
import { PlaceDetailsComponent } from './place-details/place-details.component';
import { PlaceTableComponent } from './place-table/place-table.component';

export const placesOverviewRoutes: Routes = [
  {
    path: '',
    component: PlacesOverviewComponent,
    children: [
      {
        path: '',
        component: PlaceTableComponent
      },
      {
        path: ':id',
        component: PlaceDetailsComponent
      }
    ]
  }
];
