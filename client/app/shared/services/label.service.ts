import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Profile } from '../models';

@Injectable()
export class LabelService {

  constructor(private http: HttpClient) { }

  searchByDomain(domain): Observable<any> {
    return this.http.post('/api/labels/domain', domain)
  }

  verifySection(data): Observable<any> {
    return this.http.post('/api/labels/section', data)
  }

  create(data): Observable<any> {
    return this.http.post('/api/labels/create', data)
  }

  getDetail(id): Observable<any> {
    return this.http.get(`/api/labels/detail/${id}`)
  }

}
