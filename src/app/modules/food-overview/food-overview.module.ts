import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodOverviewComponent } from './food-overview.component';
import { RouterModule } from '@angular/router';
import { foodOverviewRoutes } from './food-overview-routing';

@NgModule({
  declarations: [
    FoodOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(foodOverviewRoutes)
  ]
})
export class FoodOverviewModule { }
