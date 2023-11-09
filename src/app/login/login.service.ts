import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../Model/User/User.model';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { httpOptions } from '../shared/api/api-call';
import { environment } from '../../environments/environment';
import { tap, switchMap, map } from 'rxjs/operators';

import { Plugins } from '@capacitor/core'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@capacitor/storage';



@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(
    private http: HttpClient
  ) { }


  private _user = new BehaviorSubject<User>(null);

  private _isLogedIn = new BehaviorSubject<boolean>(false);

  userLoggedIn = new EventEmitter<boolean>();

  get user() {
    return this._user.asObservable();
  }


  get isUserLogedIn() {
    return this._isLogedIn.asObservable();
  }

  validateUser(user: { username: string, password: string }) {
    let body = new URLSearchParams();
    body.set('username', user.username);
    body.set('password', user.password);

    return this.http.post<{ SUCCESS: boolean, VALIDATEUSER: any[], SIBLINGS: any[] }>(
      environment.baseURL + 'users/validateUser',
      body.toString(),
      httpOptions
    ).pipe(
      map(result => {
        let user: User;
        // console.log("result=====>>", result)
        if (result.hasOwnProperty('SUCCESS') && result.SUCCESS && result.VALIDATEUSER.length > 0) {
          user = new User(
            result.VALIDATEUSER[0].season_id,
            result.VALIDATEUSER[0].client_id,
            result.VALIDATEUSER[0].adminLevel,
            result.VALIDATEUSER[0].person_id,
            result.VALIDATEUSER[0].username,
            result.VALIDATEUSER[0].password,
          )
          return user;
        } else {
          return null;
        }
      }),
      tap(
        result => {
          if (result) {

            this.userLoggedIn.emit(true);
            this._isLogedIn.next(true);
            this.storeUserData(result);
            this._user.next(result);
            // console.log("result --" + result);
          }
        },
        error => {
          console.log("error....");
        }
      )
    )
  }

  logout() {
    this._isLogedIn.next(false);
    this.userLoggedIn.emit(false);
    this.removeStoredData('userData');
  }

  autoLogin() {
    return from(Storage.get({ key: 'userData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value);
        if (parsedData) {
          const user = new User(
            parsedData._season_id,
            parsedData._client_id,
            parsedData._adminLevel,
            parsedData._person_id,
            parsedData._username,
            parsedData._password,
          );
          return user;

        } else {
          return null;
        }
      }),
      tap(user => {
        if (user) {
          this.userLoggedIn.emit(true);
          this._isLogedIn.next(true);
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  resetPassword(username) {
    let body = new URLSearchParams();
    body.set('username', username.toString());

    return this.http.post<{ SUCCESS: boolean, RESETPASSWORD: boolean }>(
      environment.baseURL + 'users/ResetPassword',
      body.toString(),
      httpOptions
    ).pipe(
      map(result => {
        return result;
      })
    )
  }

  storeUserData(user: User) {
    Storage.set({
      key: 'userData',
      value: JSON.stringify(user)
    })
  }

  removeStoredData(key: string) {
    this._isLogedIn.next(false);
    Storage.remove({ key: 'userData' }).then(
      () => console.log("removed...")
    );
  }

}
