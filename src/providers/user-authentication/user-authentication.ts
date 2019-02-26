import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { LoginResponse } from '../../interfaces/loginResponse';

@Injectable()
export class UserAuthenticationProvider {
  user:User;
  public hasLoggedIn:Boolean = false;

  constructor(public http: HttpClient) {
    //console.log('Hello UserAuthenticationProvider Provider');
  }




  login(user:User){
    const loginPath:string = "http://media.mw.metropolia.fi/wbma/login";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
  };
    return this.http.post<LoginResponse>(loginPath, user, httpOptions);
  }




  checkUsername(username){
    const checkUsernamePath:string = "http://media.mw.metropolia.fi/wbma/users/username/"+username;
    return this.http.get(checkUsernamePath);
  }


  register(user:User){
    const registerPath:string = "http://media.mw.metropolia.fi/wbma/users";

    return this.http.post(registerPath, user);
  }

  //check whether a user has logged in/not logged out

  checkToken() {
    const userUrl: string = "http://media.mw.metropolia.fi/wbma/users/user";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      }),
    };
    return this.http.get<User>(userUrl, httpOptions);
  }


}
