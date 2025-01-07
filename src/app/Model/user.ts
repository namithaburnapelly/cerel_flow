//user model
export interface IUser {
  email: string;
  id: string;
}

//auth model
export interface IAuthInfo {
  payload?: IUser;
  accessToken?: string;
  expiresAt?: string;
}
