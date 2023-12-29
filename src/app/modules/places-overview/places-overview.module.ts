import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesOverviewComponent } from './places-overview.component';
import { RouterModule } from '@angular/router';
import { placesOverviewRoutes } from './places-overview-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEditPlaceComponent } from './create-edit-place/create-edit-place.component';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../shared/shared.module';
import { PlaceDetailsComponent } from './place-details/place-details.component';
import { PlaceTableComponent } from './place-table/place-table.component';
import { FirestorePlaceDataService } from '../../services/firestore-data/firestore-place-data.service';
import { FirestoreConstantsDataService } from '../../services/firestore-data/firestore-constants-data.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FirestoreFoodDataService } from '../../services/firestore-data/firestore-food-data.service';
import { GooglePhotosService } from '../../services/google-photos.service';

@NgModule({
  declarations: [
    PlacesOverviewComponent,
    CreateEditPlaceComponent,
    PlaceDetailsComponent,
    PlaceTableComponent
  ],
  imports: [
    TagInputModule,
    CommonModule,
    RouterModule.forChild(placesOverviewRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ],
  providers: [
    FirestorePlaceDataService,
    FirestoreFoodDataService,
    FirestoreConstantsDataService,
    GooglePhotosService
  ]
})
export class PlacesOverviewModule { }
