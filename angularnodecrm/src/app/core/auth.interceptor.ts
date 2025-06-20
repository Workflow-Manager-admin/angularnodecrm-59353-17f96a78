import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// PUBLIC_INTERFACE
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = inject(AuthService);
    const jwt = authService ? authService.getToken() : null;
    let authReq = req;
    if (jwt && req.url.startsWith('/api/')) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${jwt}` }
      });
    }
    return next.handle(authReq);
  }
}
