import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGaurd implements CanActivate {
  constructor(private authState: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.secure(route);
  }

  private secure(route: ActivatedRouteSnapshot | Route): Observable<boolean> {
    return this.authState.stateItem$.pipe(
      map((user) => {
        const token: string | undefined = user?.accessToken;
        if (!user || this.authState.isTokenExpired(token ?? null)) {
          console.log('user not logged in cannot access home page');
          this.router.navigateByUrl('/login');
          this.authState.removestate();
          return false;
        }
        return true;
      })
    );
  }
}
