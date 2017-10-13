import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Rx';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardLogin implements CanActivate {

  constructor(public auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth.isAuthenticated.map((auth) => {
      
      if(auth && this.auth.getCurrentUser().status === 'pending'){
        this.router.navigate(['/settings/setup']);
        return true;
      }

      return auth;
      
    }).take(1);

  }

}
