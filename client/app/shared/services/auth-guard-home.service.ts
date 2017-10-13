import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/take';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardHome implements CanActivate {

  constructor(public auth: AuthService, private router: Router) {}

  isAuthenticated = false;

  canActivate(): Observable<boolean> { 

    return this.auth.isAuthenticated.map((auth) => {

      const user = this.auth.getCurrentUser();

      if(auth && user.status === 'active'){
        this.router.navigate(['/', user.username]);
        return;
      }

      if(auth && user.status === 'pending'){
        this.router.navigate(['/settings/setup']);
        return true;
      }

      return true;
      
    }).take(1);
  
  }

}
