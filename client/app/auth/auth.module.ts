import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared';

const authRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    }
]);

@NgModule({
    imports: [
        authRouting,
        SharedModule
    ],
    declarations: [
        LoginComponent,
        SignupComponent
    ]
})

export class AuthModule {}