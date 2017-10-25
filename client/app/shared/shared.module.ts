import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { LabelModalComponent } from './label-modal/label-modal.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { LabelService } from './services/label.service';
import { NotificationsSharedComponent } from './notifications';

 
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MomentModule
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
    ShowAuthedDirective,
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    LabelModalComponent,
    ShowAuthedDirective,
    NotificationsSharedComponent
  ],
  entryComponents: [
    LabelModalComponent,
    NotificationsSharedComponent
  ],
  providers: [
    ToastComponent, 
    LabelService,
  ]
})
export class SharedModule { }
