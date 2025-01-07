//user model
export interface IUser {
  id: string;
  email: string;
  password: string;
}

//auth model
export interface IAuthInfo {
  payload?: IUser;
  accessToken?: string;
  expiresAt?: string;
}

//model for data stored in local storage
export interface UserInfo {
  accessToken: string;
  email: string;
}
