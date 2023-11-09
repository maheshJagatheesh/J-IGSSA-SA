import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions } from '../shared/api/api-call';
import { UserService } from '../shared/user/user.service';
import { FilterService } from '../shared/Filter/filter.service';
import { environment } from 'src/environments/environment';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { FixtureModel } from '../Model/Fixture.model';
import { FilterModel } from '../Model/Filter/Filter.model';

export interface GetLadderGame {
  SUCCESS: boolean,
  GETFILTERTEAMLIST: [],
  GETFILTERDIVISIONLIST: [],
  GETFILTERSCHOOLLIST: [],
  GETFILTERROUNDLIST: [],
  GETFILTERSPORTLIST: [],
  GETSCORINGLIST: []
}

@Injectable({
  providedIn: 'root'
})


export class ScoringService {

  constructor(
    private http: HttpClient,
    private filterservice: FilterService,
    private userServise: UserService
  ) { }

  getScoringListTierBased(device_id: string, device_name: string, loadFavourite) {

    let body = new URLSearchParams();
    body.set('clientTimeZone', '');
    body.set('eventDate', '');
    body.set('favouriteTeamIds', JSON.stringify(this.filterservice.selectedFavourites));
    body.set('Client_ids', JSON.stringify(this.filterservice.selectedSports));
    body.set('Gamerounds', JSON.stringify(this.filterservice.selectedRounds));
    body.set('Division_ids', JSON.stringify(this.filterservice.selectedDivision));
    body.set('Club_ids', JSON.stringify(this.filterservice.selectedSchools));
    body.set('DeviceKey', device_id);
    body.set('DeviceName', device_name);
    body.set('loadFavourite', loadFavourite);
    // body.set('masterClientId', environment.masterClientId);
    body.set('masterPersonId', environment.masterPersonId);
    body.set('AppName', environment.appName);

    if (this.filterservice.selectedAssociationId) {
      body.set('associationid', this.filterservice.selectedAssociationId);
    }

    return this.userServise.getUser().pipe(
      switchMap(user => {
        if (user) {
          console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
          // body.set('person_id', '26861');
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {

        return this.http.post<{
          GETFILTERTEAMLIST: [],
          GETFILTERDIVISIONLIST: [],
          GETFILTERSCHOOLLIST: [],
          GETFILTERROUNDLIST: [],
          GETFILTERSPORTLIST: [],
          GETSCORINGLIST: [],
          SUCCESS: []
        }>(
          environment.baseURL + 'events/getScoringListTierBased',
          body.toString(),
          httpOptions
        )
      }),
      map(result => {
        const fixtureList = [];
        return {
          GETSCORINGLIST: result.GETSCORINGLIST,
          filter: new FilterModel(
            result.GETFILTERTEAMLIST,
            result.GETFILTERDIVISIONLIST,
            result.GETFILTERSCHOOLLIST,
            result.GETFILTERROUNDLIST,
            result.GETFILTERSPORTLIST
          )
        };

        // return result;
      }),
      take(1),
      tap(result => {
        console.log(result);

        this.filterservice.setFilterData(
          {
            favouriteTeamList: result.filter.favouriteTeamList,
            divivsionList: result.filter.divivsionList,
            schoolList: result.filter.schoolList,
            roundList: result.filter.roundList,
            sportList: result.filter.sportList
          }
        );

        // this.filterservice._filterData.next(
        //   new FilterModel(
        //     result.GETFILTERTEAMLIST,
        //     result.GETFILTERDIVISIONLIST,
        //     result.GETFILTERSCHOOLLIST,
        //     result.GETFILTERROUNDLIST,
        //     result.GETFILTERSPORTLIST
        //   )
        // );
        // this.filterservice.loadFilter.emit({ flag: true, page: 1 });
      },
        error => {
          console.log(error);
        })
    )
  }
}
