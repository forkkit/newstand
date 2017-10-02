import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private jwtService: JwtService
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //Initial cookie store req as oAuth2 strategy uses res.cookie on backend
    const cookieToken = this.cookieService.get('token');
    if(cookieToken){
      this.cookieService.delete('token');
    }

    const token = (cookieToken) ? cookieToken : this.jwtService.getToken();
    
    request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
    });

    return next.handle(request);
  }
}