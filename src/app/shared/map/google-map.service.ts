import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  constructor() { }

  getGoogleMaps(): Promise<any>{
    const win = window as any;
    const googleModule = win.google;

    if( googleModule && googleModule.maps ){ 
      return Promise.resolve(googleModule.maps)
    }
    return new Promise( (resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAW9EjBle0F9R6hUW7IwfV610KOMAI4E1Y';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = ()=>{
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject("Map SDK not found");
        }
      }
    })
  }
}
