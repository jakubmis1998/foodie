import { Routes } from '@angular/router';
import { FoodOverviewComponent } from './food-overview.component';

export const foodOverviewRoutes: Routes = [
  {
    path: '',
    component: FoodOverviewComponent,
    children: []
  }
];
