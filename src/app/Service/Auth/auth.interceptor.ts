import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

//Interceptor here is used to take the url and attach the authorization token to it every time a api call is made.

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  const newReqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${authService.getAuthToken()}`
    ),
  });
  return next(newReqWithHeader).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        authService.removestate();
        router.navigate(['/login'], {
          queryParams: { error: 'Your Session expired. Please log in again.' },
        });
      }
      return throwError(() => error);
    })
  );
}
