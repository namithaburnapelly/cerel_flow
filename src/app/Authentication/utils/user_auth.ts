import { UserInfo } from '../../expense/Model/user';
import { AuthService } from '../Service/auth.service';

//the below function returns a promise, as angular initializer expects a value to be resolved before an application starts
//it can return either observable or promise

//promise - if authfactory performs asyn tasts like fetching data or checking localstorage
//observable - if involves http request in authfactory

export const authFactory = (authService: AuthService): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const _localuser: UserInfo = JSON.parse(
        localStorage.getItem('user') || '{}',
      );

      if (_localuser && _localuser.accessToken) {
        authService.setState(_localuser);
      } else {
        authService.removestate();
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
