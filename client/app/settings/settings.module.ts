import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ngfModule } from "angular-file";

import { SettingsComponent } from './settings.component';
import { SettingsSetupComponent } from './setup/setup.component';
import { SettingsProfileComponent } from './profile/profile.component';
import { SettingsPublicationsComponent } from './publications/publications.component';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsNotificationsComponent } from './notifications/notifications.component';

import { 
    WizardModule
  } from './publications/wizard/wizard.module';

import { 
    AuthGuardSetup,
    AuthGuardLogin,
    SharedModule
  } from '../shared';

const settingsRouting: ModuleWithProviders = RouterModule.forChild([
    { path: 'settings', component: SettingsComponent,
        children: [
            { path: 'profile', component: SettingsProfileComponent, canActivate: [ AuthGuardLogin], data: { title: 'Newstand | Settings - Profile'} },
            { path: 'account', component: SettingsAccountComponent, canActivate: [ AuthGuardLogin], data: { title: 'Newstand | Settings - Account'} },
            { path: 'publications', component: SettingsPublicationsComponent, canActivate: [ AuthGuardLogin], data: { title: 'Newstand | Settings - Publications'}},
            { path: 'publications/create', loadChildren: 'app/settings/publications/wizard/wizard.module#WizardModule'},
            { path: 'notifications', component: SettingsNotificationsComponent, canActivate: [ AuthGuardLogin], data: { title: 'Newstand | Settings - Notifications'} },
        ]
    },
    { path: 'settings/setup', component: SettingsSetupComponent, canActivate: [ AuthGuardSetup] },
]);

@NgModule({
    imports: [
        CommonModule,
        settingsRouting,
        SharedModule,
        WizardModule,
        ngfModule,
    ],
    declarations: [
        SettingsComponent,
        SettingsSetupComponent,
        SettingsProfileComponent,
        SettingsAccountComponent,
        SettingsPublicationsComponent,
        SettingsNotificationsComponent
    ]
})

export class SettingsModule {}