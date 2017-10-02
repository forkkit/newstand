import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardSetup implements CanActivate {

  constructor(public auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth.isAuthenticated.map((auth) => {

      if(auth){

        // Require user to setup ac
        if(this.auth.getCurrentUser().status === 'pending'){
          return true;
        }

        // Active user
        this.router.navigate(['/']);
        return true;

      }

      return auth;
      
    }).take(1);

  }

}
