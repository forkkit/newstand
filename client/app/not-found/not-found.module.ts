import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { AuthGuardHome } from '../shared';

const notfoundRouting: ModuleWithProviders = RouterModule.forChild([
    { path: 'notfound', component: NotFoundComponent },
  //  { path: '**', redirectTo: '/notfound' },
]);

@NgModule({
  imports: [
    notfoundRouting
  ],
  declarations: [
    NotFoundComponent
  ]
})
export class NotFoundModule {}