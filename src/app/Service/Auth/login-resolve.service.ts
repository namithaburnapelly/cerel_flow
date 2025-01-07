import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginResolve implements Resolve<boolean> {
  constructor(private authState: AuthService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authState.stateItem$.pipe(
      map((user) => {
        const token: string | undefined = user?.accessToken;
        if (this.authState.isTokenExpired(token ?? null)) {
          return true;
        }
        if (user && user.accessToken) {
          console.log(user, 'from login resolve');
          this.router.navigateByUrl('/private/home');
          return false;
        }
        return true;
      })
    );
  }
}
