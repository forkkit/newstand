import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared';

const authRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Newstand | Login'}
    },
    {
        path: 'signup',
        component: SignupComponent, 
        data: { title: 'Newstand | Sign up'}
    }
]);

@NgModule({
    imports: [
        CommonModule,
        authRouting,
        SharedModule
    ],
    declarations: [
        LoginComponent,
        SignupComponent
    ]
})

export class AuthModule {}