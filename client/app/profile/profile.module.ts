import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { PublisherComponent } from './publisher/publisher.component';
import { ProfileResolver } from './profile-resolver.service';
import { AuthGuardLogin } from '../shared';

const profileRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: ':username',
    component: UserComponent,
    resolve: {
      profile: ProfileResolver
    },
    children: [
      {
        path: '',
        component: PublisherComponent
      }
    ]
  }
]);

@NgModule({
  imports: [
    profileRouting
  ],
  declarations: [
    UserComponent,
    PublisherComponent
  ],
  providers: [
    ProfileResolver
  ]
})
export class ProfileModule {}