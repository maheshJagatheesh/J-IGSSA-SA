import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor() {}

  async getDeviceId() {
    let info: any = await Device.getInfo();
    const id = await Device.getId();
    info['uuid'] = id.uuid;
    return info;
  }

  getFCMToken() {
    return from(localStorage.getItem('FCMToken')).pipe(
      map((storedData: any) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value);
        // console.log("parsedData" + JSON.stringify(parsedData));

        if (parsedData) {
          // const user = new User(
          //   parsedData._season_id,
          //   parsedData._client_id,
          //   parsedData._adminLevel,
          //   parsedData._person_id
          // );
          return {};
        } else {
          return null;
        }
      })
    );
  }
}
