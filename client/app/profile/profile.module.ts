import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { ProfileAuthService } from './services';
import { AuthGuardLogin, SharedModule } from '../shared';

import {
  FeedComponent,
  ProfileFlagsComponent,
  ProfileFlagsDetailComponent,
} from './components';

const profileRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: ':username',
    component: ProfileComponent,
      children: [
        { path: '', pathMatch: 'full', component: FeedComponent, data: { title: 'Newstand | Profile', page: 'feed'} },
        { path: 'flags', component: ProfileFlagsComponent, data: { title: 'Newstand | Flags', page: 'flag'} },
        { path: 'flags/:id', component: ProfileFlagsDetailComponent, data: { title: 'Newstand | Flag Detail', page: 'flag'} },
      ]
  }
  
]);

@NgModule({
  imports: [
    SharedModule,
    profileRouting,
    CommonModule
  ],
  declarations: [
    ProfileComponent,
    ProfileFlagsComponent,
    ProfileFlagsDetailComponent,
    FeedComponent
  ],
  providers: [
    ProfileAuthService
  ]
})
export class ProfileModule {}