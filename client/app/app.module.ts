import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { CatService } from './services/cat.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { CatsComponent } from './cats/cats.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { OrganizationComponent } from './organization/organization.component';
import { UserComponent } from './user/user.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    CatsComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    OrganizationComponent,
    UserComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    CatService,
    UserService,
    CookieService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
