import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { UserProfileComponent } from './user/user.component';
import { PublisherProfileComponent } from './publisher/publisher.component';
import { ProfileAuthService } from './services';
import { AuthGuardLogin, SharedModule } from '../shared';

const profileRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: ':username',
    component: ProfileComponent,
    data: { title: 'Newstand | Profile'}
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
    UserProfileComponent,
    PublisherProfileComponent
  ],
  providers: [
    ProfileAuthService
  ]
})
export class ProfileModule {}