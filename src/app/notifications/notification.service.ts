import { Injectable } from '@angular/core';
import { httpOptions } from '../shared/api/api-call';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap, take } from 'rxjs/operators';
import { UserService } from '../shared/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
    private userServise: UserService
  ) { }

  loadMyTeamNotification(deviceId: string, deviceName: string, newestFirst: number, messageType: number) {
    let body = new URLSearchParams();

    body.set('newestFirst', newestFirst.toString());
    body.set('masterPersonId', environment.masterPersonId);
    body.set('messageType', messageType.toString());
    body.set('isFavTeam', '1');
    return this.userServise.getUser().pipe(
      switchMap(user => {
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        if (user) {
          // console.log("person Id - id" + user.personId.toString());
          body.set('PersonId', user.personId.toString());
        } else {
          body.set('deviceKey', deviceId);
          body.set('deviceName', deviceName);
        }
        return this.http.post<{ GETGROUPMESSAGE: [], SUCCESS: boolean }>(
            environment.baseURL + 'players/AssociationNotification',
            body.toString(),
            httpOptions
          );
      }),
      map(result => {
        return result;
      })
    );
    // return this.http.post<{ GETGROUPMESSAGE: [], SUCCESS: boolean }>(
    //   environment.baseURL + 'players/AssociationNotification',
    //   body.toString(),
    //   httpOptions
    // ).pipe(
    //   map(data => {
    //     return data;
    //   })
    // )
  }

  loadAllNotification(messageType: number) {
    let body = new URLSearchParams();
    // body.set('DeviceKey', '');
    // body.set('DeviceName', '');
    body.set('newestFirst', '1');
    body.set('messageType', messageType.toString());
    body.set('masterPersonId', environment.masterPersonId);
    body.set('isFavTeam', '0');
    return this.userServise.getUser().pipe(
      switchMap(user => {
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        if (user) {
          // console.log("person Id - id" + user.personId.toString());
          body.set('PersonId', user.personId.toString());
        } else {
          body.set('deviceKey', '');
          body.set('deviceName', '');
        }
        return this.http.post<{ GETGROUPMESSAGE: [], SUCCESS: boolean }>(
            environment.baseURL + 'players/AssociationNotification',
            body.toString(),
            httpOptions
          );
      }),
      map(result => {
        return result;
      })
    );

    // return this.http.post<{ GETGROUPMESSAGE: [], SUCCESS: boolean }>(
    //   environment.baseURL + 'players/AssociationNotification',
    //   body.toString(),
    //   httpOptions
    // ).pipe(
    //   map(data => {
    //     return data;
    //   })
    // )
  }

  loadLandingPageNotification(DeviceKey, DeviceName) {
    let body = new URLSearchParams();
    // body.set('DeviceKey', DeviceKey);
    // body.set('DeviceName', DeviceName);
    body.set('newestFirst', '1');
    body.set('masterPersonId', environment.masterPersonId);
    body.set('messageType', '1');

    return this.userServise.getUser().pipe(
      switchMap(user => {
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        if (user) {
          // console.log("person Id - id" + user.personId.toString());
          body.set('PersonId', user.personId.toString());
        } else {
          body.set('deviceKey', DeviceKey);
          body.set('deviceName', DeviceName);
        }
        return this.http.post<{ GETGROUPMESSAGE: [], SUCCESS: boolean }>(
            environment.baseURL + 'players/AssociationNotification',
            body.toString(),
            httpOptions
          );
      }),
      map(result => {
        return result;
      })
    );

    // return this.http.post<{ GETGROUPMESSAGE: [], SUCCESS: boolean }>(
    //   environment.baseURL + 'players/AssociationNotification',
    //   body.toString(),
    //   httpOptions
    // ).pipe(
    //   map(data => {
    //     return data.GETGROUPMESSAGE.slice(0, 4);
    //   })
    // )
  }

  loadNotificationDetails(id) {
    console.log(id)
    let body = new URLSearchParams();
    body.set('notificationId', id.toString());

    return this.http.post<{ GETGROUPMESSAGE: any[], SUCCESS: boolean }>(
      environment.baseURL + 'players/viewAssociationNotification',
      body.toString(),
      httpOptions
    ).pipe(
      map(result => {
        return result;
      })
    )
  }

}
