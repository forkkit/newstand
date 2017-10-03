import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ngfModule } from "angular-file";

import { SetupComponent } from './setup/setup.component';
import { 
    AuthGuardSetup,
    SharedModule
  } from '../shared';

const settingsRouting: ModuleWithProviders = RouterModule.forChild([
    { path: 'settings', 
        children: [
        { path: 'setup', component: SetupComponent, canActivate: [ AuthGuardSetup] },
        ]
    },
]);

@NgModule({
    imports: [
        settingsRouting,
        SharedModule,
        ngfModule
    ],
    declarations: [
        SetupComponent
    ]
})

export class SettingsModule {}