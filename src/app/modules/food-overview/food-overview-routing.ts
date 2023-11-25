import { Routes } from '@angular/router';
import { FoodOverviewComponent } from './food-overview.component';
import { FoodTableComponent } from './food-table/food-table.component';
import { FoodDetailsComponent } from './food-details/food-details.component';

export const foodOverviewRoutes: Routes = [
  {
    path: '',
    component: FoodOverviewComponent,
    children: [
      {
        path: '',
        component: FoodTableComponent
      },
      {
        path: ':id',
        component: FoodDetailsComponent
      }
    ]
  }
];
