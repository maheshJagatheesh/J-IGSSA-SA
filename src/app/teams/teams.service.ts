import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ClubListModel } from '../Model/Teams/ClubListModel';
import { environment } from 'src/environments/environment';

import { tap, switchMap, map, take } from 'rxjs/operators';
import { ClubList } from '../Model/Teams/ClubList';

import { httpOptions } from '../shared/api/api-call';
import { TeamByClubModel } from '../Model/Teams/TeamByClubModel';
import { UserService } from '../shared/user/user.service';
import { Favourite } from '../Model/Teams/Favourite.model';
import { FilterService } from '../shared/Filter/filter.service';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private http: HttpClient,
    private userServise: UserService,
    private filterservice: FilterService
  ) { }

  private _clubList = new BehaviorSubject<ClubList[]>([]);
  private _teamByClub = new BehaviorSubject([]);
  onFavoutiteRemove = new EventEmitter<boolean>();
  loadExplore = new EventEmitter<boolean>();

  get clubList() {
    return this._clubList.asObservable();
  }

  get teamByClib() {
    return this._teamByClub.asObservable();
  }

  loadClubList() {

    let body = new URLSearchParams();
    body.set('masterPersonId', environment.masterPersonId);

    if (this.filterservice.selectedAssociationId) {
      body.set('associationID', this.filterservice.selectedAssociationId);
    }
    return this.userServise.getUser().pipe(
      switchMap(user => {
        if (user) {
          console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        return this.http.post<ClubListModel>(
          environment.baseURL + 'teams/getClubList',
          body.toString(),
          httpOptions
        )
      }),
      map(result => {
        const clubList = [];
        if (result.hasOwnProperty('GETCLUBLIST')) {
          for (let key in result.GETCLUBLIST) {
            clubList.push(result.GETCLUBLIST[key]);
          }
        }
        return clubList;

      }),

      tap(clubList => {
        console.log(clubList);
        this._clubList.next(clubList);
      }, error => {
        console.log(error);
      })
    )

  }

  loadTeamByClub(Club_id: string, device_id: string, device_name: string) {
    let body = new URLSearchParams();
    body.set('Club_id', Club_id.toString());
    body.set('masterPersonId', environment.masterPersonId);
    body.set('AppName', environment.appName);
    if (this.filterservice.selectedAssociationId) {
      body.set('associationId', this.filterservice.selectedAssociationId);
    }

    return this.userServise.getUser().pipe(
      switchMap(user => {
        if (user) {
          console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
        } else {
          body.set('AppName', environment.appName);
          body.set('DeviceKey', device_id);
          body.set('DeviceName', device_name);
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        return this.http.post<TeamByClubModel>(
          environment.baseURL + 'teams/getTeamByClub',
          body.toString(),
          httpOptions
        )
      }),
      map(result => {
        const team = [];
        for (let key in result.GETTEAMBYCLUB) {
          team.push(result.GETTEAMBYCLUB[key]);
        }
        return result
      }),
      tap(team => {
        this._teamByClub.next(team.GETTEAMBYCLUB);
      })
    )

  }

  loadFavouriteTeams(uuid: string, deviceName: string) {

    let body = new URLSearchParams();
    let urlEndPoint = 'teams/getFavouriteTeamByDeviceId';
    body.set('AppName', environment.appName);
    if (this.filterservice.selectedAssociationId) {
      body.set('associationID', this.filterservice.selectedAssociationId);
    }
    return this.userServise.getUser().pipe(
      switchMap(user => {
        if (user) {
          console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
          urlEndPoint = 'teams/getFavouriteTeam';
        } else {
          body.set('AppName', environment.appName);
          body.set('DeviceKey', uuid);
          body.set('DeviceName', deviceName);
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        return this.http.post<{ SUCCESS: boolean, GETFAVOURITETEAM: Favourite[] }>(
          environment.baseURL + urlEndPoint,
          body.toString(),
          httpOptions
        )
      }),
      map(result => {
        const favouriteTeams = [];
        if (result.hasOwnProperty('SUCCESS') && result.SUCCESS) {
          for (let key in result.GETFAVOURITETEAM) {
            favouriteTeams.push(result.GETFAVOURITETEAM[key]);
          }
        }
        return favouriteTeams;
      })

    )
  }

  setFavouriteTeam(club_division_id: string, DeviceKey: string, DeviceName: string) {
    let body = new URLSearchParams();
    body.set('club_division_id', club_division_id.toString());
    body.set('AppName', environment.appName);
    let urlEndPoint = 'teams/setFavouriteTeamByDeviceId';

    return this.userServise.getUser().pipe(
      switchMap(user => {
        if (user) {
          console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
          urlEndPoint = 'teams/setFavouriteTeam';
        } else {
          body.set('AppName', environment.appName);
          body.set('DeviceKey', DeviceKey.toString());
          body.set('DeviceName', DeviceName.toString());
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        return this.http.post<{ SUCCESS: boolean, SETFAVOURITETEAM: boolean }>(
          environment.baseURL + urlEndPoint,
          body.toString(),
          httpOptions
        )
      }),
      map(result => {
        if (result.hasOwnProperty('SUCCESS') && result.SUCCESS) {
          return result.SETFAVOURITETEAM;
        }
      })
    )


  }

  removeFavouriteTeam(favourite_team_id) {
    let body = new URLSearchParams();
    body.set('favourite_team_id', favourite_team_id.toString());
    let urlEndPoint = 'teams/removeFavouriteTeamDeviceId';

    return this.userServise.getUser().pipe(
      switchMap(user => {
        if (user) {
          urlEndPoint = 'teams/removeFavouriteTeam';
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        return this.http.post<{ SUCCESS: boolean, REMOVEFAVOURITETEAM: boolean }>(
          environment.baseURL + urlEndPoint,
          body.toString(),
          httpOptions
        )
      }),
      map(resutl => {
        return resutl.REMOVEFAVOURITETEAM
      }),
      tap((result) => {
        this.onFavoutiteRemove.emit(result);
      })

    )
  }

  filterTeams(key) {
    return this.clubList.pipe(
      take(1),
      map(clubList => {
        return clubList.filter(cl => {
          cl.club_name.includes("Kol")
          const search = cl.club_name.toUpperCase();
          const search2 = key.toUpperCase()
          return search.includes(search2)
        })
      })
    )
  }
}
