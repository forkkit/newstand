import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { NotFoundModule } from './not-found/not-found.module';

import {
  HeaderComponent,
  UserService,
  ProfilesService,
  AuthService,
  JwtService,
  AuthGuardLogin,
  AuthGuardAdmin,
  AuthGuardHome,
  AuthGuardSetup,
  TokenInterceptor,
  StreamService,
  SharedModule
} from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AuthModule,
    HomeModule,
    SettingsModule,
    SharedModule,
    AdminModule,
    NotFoundModule,
    ProfileModule,
    HttpClientModule,
    rootRouting,
  ],
  providers: [
    AuthService,
    ProfilesService,
    JwtService,
    AuthGuardLogin,
    AuthGuardAdmin,
    AuthGuardHome,
    AuthGuardSetup,
    UserService,
    StreamService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
