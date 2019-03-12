import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { LoginResponse } from '../../interfaces/loginResponse';
import { Observable } from "rxjs";

@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient) {
  }

  /**
   * Perform a user login request.
   * @param username the username of the user
   * @param password the password of the user
   */
  public login(username: string, password: string){
    const loginPath:string = "http://media.mw.metropolia.fi/wbma/login";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
  };
    return this.http.post<LoginResponse>(loginPath, {username: username, password: password}, httpOptions);
  }

  /**
   * Request the server for information about the existence of a username.
   * @param username the username
   */
  public checkUsername(username: string){
    const checkUsernamePath:string = "http://media.mw.metropolia.fi/wbma/users/username/"+username;
    return this.http.get(checkUsernamePath).flatMap(res => {
      if (!res['available']) {
        return Observable.create(true);
      }
      return Observable.create(false);
    });
  }

  /**
   * Register a new username.
   * @param username the username of the new user
   * @param password the password of the new user
   * @param email the email of the new user
   * @param fullname the full name of the new user (optional, can be null)
   */
  public register(username: string, password: string, email: string, fullname: string | null){
    const registerPath:string = "http://media.mw.metropolia.fi/wbma/users";

    return this.http.post(registerPath, fullname == null ?
      {username: username, password: password, email: email} :
      {username: username, password: password, email: email, full_name: fullname});
  }

  /**
   * Check if the login token is valid (meaning there is an active login).
   */
  public checkToken() {
    const userUrl: string = "http://media.mw.metropolia.fi/wbma/users/user";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token') || '',
      }),
    };
    return this.http.get<User>(userUrl, httpOptions);
  }

}
