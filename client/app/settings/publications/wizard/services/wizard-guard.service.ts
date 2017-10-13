import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { WizardAuth } from './wizard-auth.service';

@Injectable()
export class WizardGuard implements CanActivate {

    status: number = -1;
    steps: string[];

    constructor(
        private router: Router,
        private wizardAuth: WizardAuth
    ) {

        // Referenced for auth route redirection
        this.steps = ['setup', 'members'];
    }
  

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<boolean> { 

        //Set current publisher
        this.wizardAuth.setPublisher(route.params['id']);

        return this.wizardAuth.isReady.map((auth) => {
            
            if(auth){

                //Always allow access to first step
                if(route.data.step === -1){
                    return true;
                }
    
                const profile = this.wizardAuth.getCurrentPublisher(); 

                //Redirct to create if no publisher id or already complete
                if(!profile._id || profile.publisher.status === 2){
                    this.router.navigate(['settings/publications/create/setup']);
                    return;
                }
                
                //Dont allow access to step later than current publisher status
                const currentStep = profile.publisher.status + 1;
                if(route.data.step > currentStep){
                    this.router.navigate(['settings/publications/create/' + this.steps[currentStep], profile._id]);
                }

                return true;
            }
    
            return auth;
            
        }).take(1);
    }

}
