import { Injectable } from '@angular/core';
import { httpOptions } from '../shared/api/api-call';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, take, switchMap } from 'rxjs/operators';
import { LoginService } from '../login/login.service';
import { UserService } from './user/user.service';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private http: HttpClient, private loginService: LoginService, private userService: UserService
  ) { }

  setDeviceToken(DeviceKey, DeviceName, DeviceToken) {

    let body = new URLSearchParams();
    body.set('DeviceKey', DeviceKey);
    body.set('DeviceName', DeviceName);
    body.set('DeviceToken', DeviceToken);

    return this.userService.getUser().pipe(

      take(1),
      switchMap(user => {

        if (user) {

          //  alert('Logged In')
          body.set('personId', JSON.stringify(user.personId));
        }

        return this.userService.getUser()
      }),
      take(1),
      switchMap(userData => {
        console.log("Register device", body.toString());
        return this.http.post(

          environment.baseURL + 'push/setDeviceToken',
          body.toString(),
          httpOptions
        ).pipe(
          map(data => {
            return data;
          })
        )
      })
    )
  }
}
