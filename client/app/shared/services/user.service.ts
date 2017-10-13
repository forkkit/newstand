import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Data, User, Profile } from '../models';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  register(user): Observable<any> {
    return this.http.post('/api/users/create', user)
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/auth/local', credentials);
  }

  get(): Observable<Data> {
    return this.http.get<Data>('/api/users/me');
  }

  getUsers(): Observable<any> {
    return this.http.get('/api/users');
  }

  countUsers(): Observable<any> {
    return this.http.get('/api/users/count');
  }

  addUser(user): Observable<any> {
    return this.http.post('/api/user', user);
  }

  getUser(user): Observable<any> {
    return this.http.get(`/api/users/${user._id}`);
  }

  update(user): Observable<Profile> {
    return this.http.put(`/api/users/${user._id}`, user);
  }

  deleteUser(user): Observable<any> {
    return this.http.delete(`/api/user/${user._id}`);
  }

  

}
