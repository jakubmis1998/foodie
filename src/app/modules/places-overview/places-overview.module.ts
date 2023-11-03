import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesOverviewComponent } from './places-overview.component';
import { RouterModule } from '@angular/router';
import { placesOverviewRoutes } from './places-overview-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEditPlaceComponent } from './create-edit-place/create-edit-place.component';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PlacesOverviewComponent,
    CreateEditPlaceComponent
  ],
  imports: [
    TagInputModule,
    CommonModule,
    RouterModule.forChild(placesOverviewRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PlacesOverviewModule { }
