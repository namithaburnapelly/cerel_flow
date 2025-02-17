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
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
