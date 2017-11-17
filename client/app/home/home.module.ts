import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AuthGuardHome, SharedModule } from '../shared';

const homeRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardHome], data: { title: 'Newstand'}
  }
]);

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    homeRouting
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {}