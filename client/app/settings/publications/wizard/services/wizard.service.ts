import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Publisher, Profile } from '../../../../shared';

@Injectable()
export class WizardService {

  constructor(private http: HttpClient) { }

  get(id): Observable<any> {
    return this.http.get(`/api/wizards/${id}`)
  }

  setup(publication): Observable<Profile> {
    return this.http.post<Publisher>('/api/wizards/setup', publication);
  }

  findMember(email): Observable<Profile> {
    return this.http.get<Profile>(`/api/wizards/members/${email}`);
  }

  members(id, data): Observable<Profile> {
    return this.http.put<Profile>(`/api/wizards/members/${id}`, data);
  }

  details(id, data): Observable<Publisher> {
    return this.http.put<Publisher>(`/api/wizards/details/${id}`, data);
  }

  updateProfile(id, publication): Observable<Profile> {
    return this.http.put<Profile>(`/api/profiles/${id}`, publication);
  }


}
