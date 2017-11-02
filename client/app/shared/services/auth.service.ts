import { Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';

import { UserService } from '../services/user.service';

import { JwtService } from './jwt.service';
import { Data, Profile } from '../models';

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cookieService: CookieService
  ) {}

  private currentUserSubject = new BehaviorSubject<Profile>(new Profile());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  populate() {

    if(!this.cookieService.check('token') && !this.jwtService.getToken()){
      this.logout();
      return;
    }

    this.userService.get()
      .subscribe(
        data => this.setAuth(data.token, data.profile),
        err => this.logout()
      );

  }

  setAuth(token: string, profile: Profile) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(token);
    // Set current user data into observable
    this.currentUserSubject.next(profile);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    // Remove JWT from localstorage
    this.jwtService.deleteToken();    
    // Set current user to an empty object
    this.currentUserSubject.next(new Profile());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials) {
    return this.userService.login(credentials).map(
      data => {
        this.setAuth(data.token, data.profile);
        return data;
      },
      err => this.logout()
    );
  }

  register(profile:Profile) {
    return this.userService.register(profile).map(
      data => {
        this.setAuth(data.token, data.profile);
        return data;
      },
      err => this.logout()
    );
  }

  getCurrentUser(): Profile {
    return this.currentUserSubject.value;
  }

  update(profile:Profile) {
    this.currentUserSubject.next(profile)
  }

  userRole(profile:Profile){
    console.log(profile);
  }

}
