import { NgModule } from '@angular/core';
import { mapToCanActivate, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { CanActivateGuard } from './guards/can-activate-guard';
import { LayoutComponent } from './modules/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'food-overview',
        loadChildren: () => import('./modules/food-overview/food-overview.module').then(m => m.FoodOverviewModule)
      },
      {
        path: 'places-overview',
        loadChildren: () => import('./modules/places-overview/places-overview.module').then(m => m.PlacesOverviewModule)
      }
    ],
    canActivate: mapToCanActivate([ CanActivateGuard ])
  },
  { path: 'login', component: LoginComponent, canActivate: mapToCanActivate([ CanActivateGuard ]) },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
