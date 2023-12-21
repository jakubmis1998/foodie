import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxStarsModule } from 'ngx-stars';
import { PipesModule } from '../pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataOverviewComponent } from './components/data-overview/data-overview.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';

@NgModule({
  declarations: [
    LoadingComponent,
    DataOverviewComponent,
    ConfirmModalComponent,
    LeafletMapComponent,
    ImagePreviewComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    FontAwesomeModule,
    LeafletModule
  ],
  exports: [
    LoadingComponent,
    DataOverviewComponent,
    ConfirmModalComponent,
    LeafletMapComponent,
    NgxStarsModule,
    NgbModule,
    PipesModule,
    HighchartsChartModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
