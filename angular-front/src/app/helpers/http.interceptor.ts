import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {}

  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if ((err.status === 401 || err.status === 403) && !req.url.includes('/refreshtoken')) {
          return this.authService.refreshToken().pipe(
            switchMap(() => next.handle(req)),
            catchError((refreshErr) => {
              this.authService.signOut(); // Handle sign out if refresh fails
              this.storageService.clean();
              this.router.navigate(['/']);
              return throwError(refreshErr);
            })
          );
        }
        return throwError(err);
      })
    );
  }
  
}