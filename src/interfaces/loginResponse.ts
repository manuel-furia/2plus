import { User } from './user';

export interface LoginResponse {
  message: string;
  token: string;
  user:User;
}
