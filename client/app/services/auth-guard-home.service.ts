import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardHome implements CanActivate {

  constructor(public auth: AuthService, private router: Router) {}

  canActivate() { 

    if(this.auth.loggedIn){
      this.router.navigate(['/me']);
      return true;
    }

    return true;
  
  }

}
