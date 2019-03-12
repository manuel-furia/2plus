import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { MediaListingResponseEntry } from '../../interfaces/mediaListingResponseEntry';
import { User } from '../../interfaces/user';
import { Observable } from "rxjs";
import { UserInfoResponse } from "../../interfaces/userInfoResponse";

@Injectable()
/**
 * Provides a way to handle users.
 */
export class UserProvider {

  constructor(public http: HttpClient,
              public alertController: AlertController,
              public toastCtrl: ToastController) { }


  /**
   * Return a user, given its id.
   * @param user_id the id of the user
   */
  public getUserInfo(user_id: number): Observable<User>{
    return this.requestUserInfo(user_id).flatMap(info =>
        'full_name' in info ?
          Observable.create({ username: info.username, email: info.email, user_id: info.user_id }) :
          Observable.create({ username: info.username, email: info.email, user_id: info.user_id, fullname: info.full_name})
    );
  }

  /**
   * Perform a user information request.
   * @param user_id the id of the user
   */
  private requestUserInfo(user_id: number): Observable<UserInfoResponse>{
    const userInfoPath:string = "http://media.mw.metropolia.fi/wbma/users/"+user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-access-token': localStorage.getItem('token')  || '',
      })
    };
    return this.http.get<UserInfoResponse>(userInfoPath, httpOptions);

  }

  /**
   * Delete a user by specifying a user id.
   * @param userID the id of the user to delete
   * @return true if success, false if failure
   */
  public deleteUser(userID): Observable<boolean>{
    const deleteUserPath:string = "http://media.mw.metropolia.fi/wbma/users/"+userID;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token') || ''
      }),
    };
    return this.http.delete<Response>(deleteUserPath, httpOptions).flatMap(res => Observable.create(res.status < 400));
  }

}



