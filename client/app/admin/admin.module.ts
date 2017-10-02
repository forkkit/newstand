import { ModuleWithProviders, NgModule } from '@angular/core';
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
    adminRouting,
    SharedModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule {}