import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { DeviceService } from '../device/device.service';
import { TeamsService } from 'src/app/teams/teams.service';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteGaurdGuard implements CanLoad {

  constructor(
    private router: Router,
    private deviceService: DeviceService,
    private teamsService: TeamsService) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {

    return from(this.deviceService.getDeviceId()).pipe(
      switchMap(data => {
        return this.teamsService.loadFavouriteTeams(data.uuid.toString(), data.model)
      }),
      map(data => {
        console.log(" data --------- "+data.length )
        if(data.length != 0){
          this.router.navigateByUrl('/landing-page');
          return false;
        }else{
          return true;
        }
      })
    )
    
    // return from(
    //   this.deviceService.getDeviceId().then(data => {
    //     return this.teamsService.loadFavouriteTeams(data.uuid.toString(), data.model).subscribe(data => {
    //       console.log("Fav team length :::" + data.length);
    //       if (data.length > 0) {
    //         console.log("Fav team length :::" + data.length);
    //         this.flag = true;
    //       } else {
    //       }
    //     })       
    //   })
    // ).pipe(
    //   map(data => {
    //     console.log("data---->" + this.flag);
    //     if (data) {
    //       this.router.navigateByUrl('/landing-page');
    //     } else {
    //       return true
    //     }
    //   })
    // )

    // this.deviceService.getDeviceId().then(data => {
    //   if (data) {
    //     this.teamsService.loadFavouriteTeams(data.uuid.toString(), data.model).subscribe(data => {
    //       console.log("Fav team length :::" + data.length);
    //       if (data.length > 0) {
    //         this.router.navigateByUrl('/landing-page');
    //       } else {
    //         return true;
    //       }
    //     },
    //       error => {
    //         return true;
    //       })
    //   }
    // })

    //this.router.navigateByUrl('/landing-page');
    
    
    // return true;
  }
}
