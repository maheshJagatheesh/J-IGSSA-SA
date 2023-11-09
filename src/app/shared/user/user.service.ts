import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { User } from 'src/app/Model/User/User.model';
import { tap, map } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUser() {
    return from(Storage.get({ key: 'userData' })).pipe(
      map((storedData: any) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value);
        // console.log("parsedData" + JSON.stringify(parsedData));

        if (parsedData) {
          const user = new User(
            parsedData._season_id,
            parsedData._client_id,
            parsedData._adminLevel,
            parsedData._person_id,
            parsedData._username,
            parsedData._password
          );
          return user;
        } else {
          return null;
        }
      })
    );
  }
}
