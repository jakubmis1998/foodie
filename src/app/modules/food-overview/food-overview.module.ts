import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodOverviewComponent } from './food-overview.component';
import { RouterModule } from '@angular/router';
import { foodOverviewRoutes } from './food-overview-routing';
import { FoodTableComponent } from './food-table/food-table.component';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { CreateEditFoodComponent } from './create-edit-food/create-edit-food.component';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FirestoreFoodDataService } from '../../services/firestore-data/firestore-food-data.service';
import { FirestorePlaceDataService } from '../../services/firestore-data/firestore-place-data.service';
import { GooglePhotosService } from '../../services/google-photos.service';

@NgModule({
  declarations: [
    FoodOverviewComponent,
    FoodTableComponent,
    FoodDetailsComponent,
    CreateEditFoodComponent
  ],
  imports: [
    TagInputModule,
    CommonModule,
    RouterModule.forChild(foodOverviewRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    FirestoreFoodDataService,
    FirestorePlaceDataService,
    GooglePhotosService
  ]
})
export class FoodOverviewModule { }
