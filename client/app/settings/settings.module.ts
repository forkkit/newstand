import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ngfModule } from "angular-file";

import { SettingsComponent } from './settings.component';
import { SettingsSetupComponent } from './setup/setup.component';
import { SettingsProfileComponent } from './profile/profile.component';
import { SettingsOrganizationComponent } from './organization/organization.component';
import { SettingsCreateOrgComponent } from './organization/create-org/create-org.component';
import { SettingsOrgSetupComponent } from './organization/create-org/setup/setup.component';
import { SettingsOrgMembersComponent } from './organization/create-org/members/members.component';
import { SettingsOrgDetailsComponent } from './organization/create-org/details/details.component';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsNotificationsComponent } from './notifications/notifications.component'

import { 
    AuthGuardSetup,
    AuthGuardLogin,
    SharedModule
  } from '../shared';

const settingsRouting: ModuleWithProviders = RouterModule.forChild([
    { path: 'settings', component: SettingsComponent,
        children: [
            { path: 'setup', component: SettingsSetupComponent, canActivate: [ AuthGuardSetup] },
            { path: 'profile', component: SettingsProfileComponent, canActivate: [ AuthGuardLogin] },
            { path: 'account', component: SettingsAccountComponent, canActivate: [ AuthGuardLogin] },
            { path: 'organizations', component: SettingsOrganizationComponent, canActivate: [ AuthGuardLogin] },
            { path: 'organizations/create', component: SettingsCreateOrgComponent, canActivate: [ AuthGuardLogin],
                children: [
                    {
                      path: 'setup',
                      component: SettingsOrgSetupComponent
                    },
                    {
                    path: 'members',
                    component: SettingsOrgMembersComponent
                    },
                    {
                    path: 'details',
                    component: SettingsOrgDetailsComponent
                    }
                  ] },
            { path: 'notifications', component: SettingsNotificationsComponent, canActivate: [ AuthGuardLogin] },
        ]
    },
]);

@NgModule({
    imports: [
        settingsRouting,
        SharedModule,
        ngfModule,
    ],
    declarations: [
        SettingsComponent,
        SettingsSetupComponent,
        SettingsProfileComponent,
        SettingsAccountComponent,
        SettingsOrganizationComponent,
        SettingsCreateOrgComponent,
        SettingsOrgSetupComponent,        
        SettingsOrgMembersComponent,
        SettingsOrgDetailsComponent,
        SettingsNotificationsComponent
    ]
})

export class SettingsModule {}