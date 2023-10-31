import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { NavigationComponent } from './topbar/components/navigation/navigation.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    SharedModule
  ]
})
export class LayoutModule { }
