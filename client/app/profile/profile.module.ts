import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileComponent } from './profile.component';
import { ProfileAuthService, ProfileGuard } from './services';
import { AuthGuardLogin, SharedModule, EllipsisPipe } from '../shared';

import {
  ProfileFeedComponent,
  ProfileFlagsComponent,
  ProfileFlagsDetailComponent,
  FlagCommentComponent
} from './components';

const profileRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: ':username',
    component: ProfileComponent,
    canActivateChild: [ProfileGuard],
      children: [
        { path: '', pathMatch: 'full', component: ProfileFeedComponent, data: { title: 'Newstand | Profile', page: 'feed'} },
        { path: 'flags', component: ProfileFlagsComponent, data: { title: 'Newstand | Flags', page: 'flag'} },
        { path: 'flags/:id', component: ProfileFlagsDetailComponent, data: { title: 'Newstand | Flag Detail', page: 'flag'} },
      ]
  }
  
]);

@NgModule({
  imports: [
    SharedModule,
    profileRouting,
    CommonModule,
    QuillModule,
    NgbModule,
  ],
  declarations: [
    ProfileComponent,
    ProfileFlagsComponent,
    ProfileFlagsDetailComponent,
    ProfileFeedComponent,
    FlagCommentComponent,
    EllipsisPipe
  ],
  providers: [
    ProfileAuthService,
    ProfileGuard
  ]
})
export class ProfileModule {}