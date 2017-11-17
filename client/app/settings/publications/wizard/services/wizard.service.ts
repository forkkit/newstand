import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Profile } from '../../../../shared';

@Injectable()
export class WizardService {

  constructor(private http: HttpClient) { }

  get(id): Observable<any> {
    return this.http.get(`/api/wizards/${id}`)
  }

  setup(publication): Observable<Profile> {
    return this.http.post<Profile>('/api/wizards/setup', publication);
  }

  updateSetup(id, publication): Observable<Profile> {
    return this.http.post<Profile>(`/api/wizards/setup/${id}`, publication);
  }

  findMember(email): Observable<Profile> {
    return this.http.get<Profile>(`/api/wizards/members/${email}`);
  }

  members(id, data): Observable<Profile> {
    return this.http.put<Profile>(`/api/wizards/members/${id}`, data);
  }

  details(id, data): Observable<Profile> {
    return this.http.put<Profile>(`/api/wizards/details/${id}`, data);
  }

  segment(data): Observable<Profile> {
    return this.http.post<Profile>(`/api/wizards/segment`, data);
  }

  verify(data): Observable<Profile> {
    return this.http.put<Profile>(`/api/wizards/verify`, data);
  }

}
