import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngfModule } from "angular-file";

import { WizardComponent } from './wizard.component';
import { WizardSetupComponent } from './setup/setup.component';
import { WizardMembersComponent } from './members/members.component';
import { WizardVerifyComponent } from './verify/verify.component';

import {
    WizardGuard, 
    WizardAuth,
    WizardService
} from './services';

import { 
    AuthGuardLogin,
    SharedModule
} from '../../../shared';

const wizardRouting: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: WizardComponent, canActivate: [ AuthGuardLogin],
    children: [
        {
            path: 'setup',
            component: WizardSetupComponent,
            canActivate: [WizardGuard],
            data: { step: -1, title: 'Newstand | Publication - Setup' }
        },
        {
            path: 'setup/:id',
            component: WizardSetupComponent,
            canActivate: [WizardGuard],
            data: { step: 0, title: 'Newstand | Publication - Setup' }
        },
        {
            path: 'members/:id',
            component: WizardMembersComponent,
            canActivate: [WizardGuard],
            data: { step: 1, title: 'Newstand | Publication - Members' }
        },
        {
            path: 'verify/:id',
            component: WizardVerifyComponent,
            canActivate: [WizardGuard],
            data: { step: 2, title: 'Newstand | Publication - Verify' }
        }
      ] 
    }
]);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        wizardRouting,
        ngfModule,
        NgbModule,
        SharedModule
    ],
    declarations: [
        WizardComponent,
        WizardSetupComponent,
        WizardMembersComponent,
        WizardVerifyComponent
    ], 
    providers: [
        WizardGuard,
        WizardAuth,
        WizardService
    ]
})

export class WizardModule {}