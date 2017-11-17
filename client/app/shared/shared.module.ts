import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

import { ToastComponent } from './toast/toast.component';
import { LoadersCssModule } from 'angular2-loaders-css';
import { LoadingComponent } from './loading/loading.component';
import { FeedComponent } from './feed/feed.component';
import { FlagModalComponent } from './flag-modal/flag-modal.component';
import { UserAuthDirective } from './directives';
import { FlagService } from './services/flag.service';
import { NotificationsSharedComponent } from './notifications';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MomentModule,
    LoadersCssModule
  ],
  exports: [
    // Shared Modules
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    // Shared Components
    ToastComponent,
    LoadingComponent,
    FeedComponent,
    UserAuthDirective,
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    FeedComponent,
    FlagModalComponent,
    UserAuthDirective,
    NotificationsSharedComponent
  ],
  entryComponents: [
    FlagModalComponent,
    NotificationsSharedComponent
  ],
  providers: [
    ToastComponent, 
    FlagService,
  ]
})
export class SharedModule { }
