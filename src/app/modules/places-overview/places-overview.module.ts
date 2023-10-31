import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesOverviewComponent } from './places-overview.component';
import { RouterModule } from '@angular/router';
import { placesOverviewRoutes } from './places-overview-routing';

@NgModule({
  declarations: [
    PlacesOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(placesOverviewRoutes)
  ]
})
export class PlacesOverviewModule { }
