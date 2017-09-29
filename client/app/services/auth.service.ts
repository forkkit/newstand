import { Injectable, EventEmitter, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';

import { UserService } from '../services/user.service';

import { Data, User } from './user.model';

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  populate() {

    if(!this.cookieService.get('token')){
      this.logout();
      return;
    }

    this.userService.get()
      .subscribe(
        data => this.setAuth(data, data.user),
        err => this.logout()
      );

  }

  setAuth(data: Data, user: User) {
    // Clear out any residual
    this.cookieService.delete('token');
    // Save JWT sent from server in cookie
    this.cookieService.set('token', data.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    // Remove JWT from cookie
    this.cookieService.delete('token');
    // Set current user to an empty object
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials) {
    return this.userService.login(credentials).map(
      data => {
        this.setAuth(data, data.user);
        return data;
      },
      err => this.logout()
    );
  }

  register(user) {
    return this.userService.register(user).map(
      data => {
        this.setAuth(data, data.user);
        return data;
      },
      err => this.logout()
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }


  confirmUsername(user): Observable<Data> {
    return this.userService.username(user)
    .map((data:Data) => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return user;
    });
  }

}
