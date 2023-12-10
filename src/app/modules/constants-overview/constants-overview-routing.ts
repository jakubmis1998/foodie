import { Routes } from '@angular/router';
import { ConstantsOverviewComponent } from './constants-overview.component';
import { ConstantsTableComponent } from './constants-table/constants-table.component';

export const constantsOverviewRoutes: Routes = [
  {
    path: '',
    component: ConstantsOverviewComponent,
    children: [
      {
        path: '',
        component: ConstantsTableComponent
      }
    ]
  }
];
