import { inject, Injectable } from '@angular/core';
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
  private authState = inject(AuthService);
  private router = inject(Router);
  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authState.stateItem$.pipe(
      map((user) => {
        const token: string | undefined = user?.accessToken;
        if (this.authState.isTokenExpired(token ?? null)) {
          return true;
        }
        if (user && user.accessToken) {
          console.log(user, 'from login resolve');
          this.router.navigateByUrl('/expense');
          return false;
        }
        return true;
      }),
    );
  }
}
