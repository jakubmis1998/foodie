import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { NgxStarsModule } from 'ngx-stars';
import { PipesModule } from '../pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataOverviewComponent } from './components/data-overview/data-overview.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    LoadingComponent,
    DataOverviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    DataOverviewComponent,
    NgxStarsModule,
    NgbModule,
    PipesModule,
    HighchartsChartModule
  ]
})
export class SharedModule { }
