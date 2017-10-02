import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Profile } from '../models';

@Injectable()
export class ProfilesService {

  constructor(private http: HttpClient) { }

  get(username): Observable<any> {
    return this.http.get('/api/profiles/' + username)
  }
  
}
