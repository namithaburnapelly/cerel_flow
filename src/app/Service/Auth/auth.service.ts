import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IAuthInfo, NewUser, UserInfo } from '../../Model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loginurl = environment.loginUrl;
  private _registerurl = environment.registerUrl;

  //  Rjx subject that holds the current value and emits it to new subscribers
  private stateItem: BehaviorSubject<IAuthInfo | null> =
    new BehaviorSubject<IAuthInfo | null>(null);

  // $ to denote its a observable
  // it can be subscribed to and will emit the current value of stateItem
  // by exposing it asObservable , we give other parts read-only access to current authentication state
  stateItem$: Observable<IAuthInfo | null> = this.stateItem.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  //login method
  Login(email: string, password: string): Observable<IAuthInfo> {
    return this.http.post(this._loginurl, { email, password }).pipe(
      map((response: IAuthInfo) => {
        const userData: IAuthInfo = response;

        const returnedUser: UserInfo = {
          accessToken: userData.accessToken ?? '',
          email: userData.payload?.email ?? '',
        };

        // //save in local storage
        if (returnedUser && returnedUser.accessToken) {
          console.log('token saved to local storage');
          localStorage.setItem('user', JSON.stringify(returnedUser));
          this.stateItem.next(returnedUser); //updating the user state
        }
        return returnedUser;
      })
    );
  }

  setState(item: UserInfo) {
    this.stateItem.next(item);
  }

  removestate() {
    this.stateItem.next(null);
    localStorage.removeItem('user');
  }

  isTokenExpired(token: string | null): boolean {
    if (this.jwtHelper.isTokenExpired(token)) {
      console.log('token expired');
      return true;
    }
    return false;
  }

  Register(
    username: string,
    email: string,
    password: string
  ): Observable<NewUser> {
    return this.http.post<NewUser>(this._registerurl, {
      username,
      email,
      password,
    });
  }
}
