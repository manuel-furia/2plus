import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { LoginResponse } from '../../interfaces/loginResponse';
import { StoredSession } from "../../interfaces/storedSession";

@Injectable()
export class StorageProvider {

  constructor() {
  }

  public deleteSession(){
    localStorage.removeItem('session')
  }

  public storeSession(token: string, user: User) {
    const storedSession: StoredSession = {token: token, user: user};
    localStorage.setItem('session', JSON.stringify(storedSession));
  }

  public loadSessionToken(): string | null {
    const storedSession: StoredSession = JSON.parse(localStorage.getItem('session') || '{}');
    if ('token' in storedSession)
      return storedSession.token;
    else
      return null;
  }

  public loadSessionUser(): User | null {
    const storedSession: StoredSession = JSON.parse(localStorage.getItem('session') || '{}');
    if ('user' in storedSession)
      return storedSession.user;
    else
      return null;
  }


}
