import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Publisher, Profile } from '../models';

@Injectable()
export class PublishersService {

  constructor(private http: HttpClient) { }

  get(id): Observable<any> {
    return this.http.get(`/api/publishers/${id}`)
  }

}
