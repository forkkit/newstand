import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StreamService {

  constructor(private http: HttpClient) { }

  feed(id): Observable<any> {
    return this.http.get(`/api/streams/feed/${id}`)
  }

  follow(target): Observable<any> {
    return this.http.post('/api/streams/follow', target)
  }

  notifications(): Observable<any> {
    return this.http.get('/api/streams/notifications')
  }
  
}
