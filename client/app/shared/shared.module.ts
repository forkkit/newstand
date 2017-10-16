import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { FeedComponent } from './feed/feed.component';
import { LabelModalComponent } from './label-modal/label-modal.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { LabelService } from './services/label.service';
 
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Shared Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // Shared Components
    ToastComponent,
    LoadingComponent,
    FeedComponent,
    ShowAuthedDirective
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    FeedComponent,
    LabelModalComponent,
    ShowAuthedDirective
  ],
  entryComponents: [
    LabelModalComponent
  ],
  providers: [
    ToastComponent, 
    LabelService
  ]
})
export class SharedModule { }
