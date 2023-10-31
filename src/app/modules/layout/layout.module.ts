import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    SharedModule
  ]
})
export class LayoutModule { }
