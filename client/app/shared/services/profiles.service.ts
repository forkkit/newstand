import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Profile } from '../models';

@Injectable()
export class ProfilesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get('/api/profiles/')
  }

  get(id): Observable<any> {
    return this.http.get(`/api/profiles/${id}`)
  }

  create(publication): Observable<Profile> {
    return this.http.post<Profile>('/api/profiles', publication);
  }

  update(profile): Observable<Profile> {
    return this.http.put<Profile>(`/api/profiles/${profile._id}`, profile);
  }

  getByUsername(username): Observable<any> {
    return this.http.get(`/api/profiles/username/${username}`)
  }

  username(user): Observable<any> {
    return this.http.put('/api/profiles/username', user);
  }

  upload(data): Observable<any> {
    return this.http.post('/api/uploads', data);
  }
  
}
