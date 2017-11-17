import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthGuardAdmin, SharedModule } from '../shared';

const adminRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuardAdmin]
  }
]);

@NgModule({
  imports: [
    CommonModule,
    adminRouting,
    SharedModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule {}