import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

import { ToastComponent } from './toast/toast.component';
import { LoadersCssModule } from 'angular2-loaders-css';
import { LoadingComponent } from './loading/loading.component';
import { FlagModalComponent } from './flag-modal/flag-modal.component';
import { UserAuthDirective } from './directives';
import { FlagService } from './services/flag.service';
import { NotificationsSharedComponent } from './notifications';
 
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MomentModule,
    LoadersCssModule
  ],
  exports: [
    // Shared Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    // Shared Components
    ToastComponent,
    LoadingComponent,
    UserAuthDirective,
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
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
