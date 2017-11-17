import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/take';
import { ProfilesService } from '../../shared';

import { ProfileAuthService } from './profile-auth.service';

@Injectable()
export class ProfileGuard implements CanActivateChild {

  constructor(
    public profilesService: ProfilesService, 
    private profileAuthService: ProfileAuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> { 

    const username = route.parent.params['username'];
    const existingUser = this.profileAuthService.getCurrentProfile();

    // Check if profile already loaded
    if(username === existingUser.username){
      return Observable.of(true); 
    }

    // Empty profile object
    this.profileAuthService.dumpProfile(); 

    return this.profilesService.getByUsername(username).map(profile => { 

      // Check publisher status
      if(profile.role === 'user' && profile.type === 'publisher' && profile.status !== 'active' || !profile.publisher.public){
        this.router.navigate(["/notfound"]);
      }

      // Set current profile
      this.profileAuthService.setProfile(profile);      
      return true;
      
    }).catch(
    error => {
      this.profileAuthService.dumpProfile(); 
      this.router.navigate(["/notfound"]);
      return Observable.of(false); 
    }
  ).take(1);
  
  }

}
