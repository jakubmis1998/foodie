import { NgModule } from '@angular/core';
import { mapToCanActivate, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AppComponent } from './app.component';
import { CanActivateGuard } from './guards/can-activate-guard';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: mapToCanActivate([ CanActivateGuard ])
      }
    ]
  },
  { path: 'login', component: LoginComponent, canActivate: mapToCanActivate([ CanActivateGuard ]) },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
