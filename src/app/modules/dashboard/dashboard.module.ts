import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard-routing';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { FirestoreFoodDataService } from '../../services/firestore-data/firestore-food-data.service';
import { FirestorePlaceDataService } from '../../services/firestore-data/firestore-place-data.service';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    SharedModule
  ],
  providers: [FirestoreFoodDataService, FirestorePlaceDataService],
})
export class DashboardModule { }
