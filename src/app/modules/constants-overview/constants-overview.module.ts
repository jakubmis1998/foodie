import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConstantsOverviewComponent } from './constants-overview.component';
import { constantsOverviewRoutes } from './constants-overview-routing';
import { ConstantsTableComponent } from './constants-table/constants-table.component';
import { CreateEditConstantComponent } from './create-edit-constant/create-edit-constant.component';
import { SharedModule } from '../../shared/shared.module';
import { FirestoreConstantsDataService } from '../../services/firestore-data/firestore-constants-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConstantsOverviewComponent,
    ConstantsTableComponent,
    CreateEditConstantComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(constantsOverviewRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [FirestoreConstantsDataService],
})
export class ConstantsOverviewModule { }
