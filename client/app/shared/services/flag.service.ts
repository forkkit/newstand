import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Profile } from '../models';

@Injectable()
export class FlagService {

  constructor(private http: HttpClient) { }

  searchByDomain(domain): Observable<any> {
    return this.http.post('/api/flags/domain', domain)
  }

  verifySection(data): Observable<any> {
    return this.http.post('/api/flags/section', data)
  }

  create(data): Observable<any> {
    return this.http.post('/api/flags/create', data)
  }

  getDetail(id): Observable<any> {
    return this.http.get(`/api/flags/detail/${id}`)
  }

  activity(data): Observable<any> {
    return this.http.post('/api/flags/activity', data)
  }

}
