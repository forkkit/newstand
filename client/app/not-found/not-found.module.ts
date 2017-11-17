import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { AuthGuardHome } from '../shared';

const notfoundRouting: ModuleWithProviders = RouterModule.forChild([
    { path: 'notfound', component: NotFoundComponent, data: { title: 'Newstand | Page not found'} }
]);

@NgModule({
  imports: [
    notfoundRouting,
    CommonModule
  ],
  declarations: [
    NotFoundComponent
  ]
})
export class NotFoundModule {}