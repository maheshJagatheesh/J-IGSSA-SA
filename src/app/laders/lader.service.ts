import { Injectable } from '@angular/core';
import { httpOptions } from '../shared/api/api-call';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { UserService } from '../shared/user/user.service';
import { FilterService } from '../shared/Filter/filter.service';

export interface GetLadderGame {
  GETGAME: [];
  FAVOURITETEAM: [];
  SUCCESS: boolean;
}

export interface TableHeader {
  label: string;
  id: number;
  databaseColumn: string;
}

export interface ResultMicroTierBased_V3 {
  SUCCESS: boolean;
  GETLADDERRESULT: [
    {
      sportName: string;
      sportFlag: string;
      bannerImage: string;
      sportBanner: string;
      clientLogo: string;
      clientName: string;
      clientID: string;
      divisionGroup: [
        {
          divisionId: string;
          divisionName: string;
          gradingPoolPoints: [
            {
              poolId: string;
              poolName: string;
              gradingLadder: [];
            }
          ];
        }
      ];
    },
    TableHeader[]
  ];
}

@Injectable({
  providedIn: 'root',
})
export class LaderService {
  constructor(
    private http: HttpClient,
    private userServise: UserService,
    private filterservice: FilterService
  ) {}

  private _ladderResult = new BehaviorSubject([]);

  get ladderResult() {
    return this._ladderResult;
  }

  loadLadderResult(clubDivisionId: string) {
    let body = new URLSearchParams();
    // body.set('clubDivisionId', clubDivisionId);
    body.set('divisionId', clubDivisionId);
    body.set('masterPersonId', environment.masterPersonId);

    return this.userServise.getUser().pipe(
      switchMap((user) => {
        if (user) {
          // console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap((user) => {
        return this.http.post<{
          SUCCESS: boolean;
          GETLADDERRESULTFINAL: [];
          GETLADDERRESULTFINALTITLE: string;
          GETLADDERRESULTGRADING: [];
          GETLADDERRESULTGRADINGTITLE: string;
          GETLADDERRESULTTITLE: string;
          GETLADDERRESULT: [];
          CLUBLOGO: [
            {
              clubSuburb: string;
              clubId: string;
              clubName: string;
              logopath: string;
              clientLogo: string;
              bannerImage: string;
              sportBanner: string;
            }
          ];
        }>(
          // environment.baseURL + 'events/getLadderResult',
          // environment.baseURL + 'events/getLadderResultMicroTierBased_V3',
          environment.baseURL + 'events/getLadderResultTierBased',
          body.toString(),
          httpOptions
        );
      }),
      map((result) => {
        // console.log(result.GETLADDERRESULT.length);
        const pointData = [];
        for (let key in result.GETLADDERRESULT) {
          console.log(key);
          pointData.push(result.GETLADDERRESULT[key]);
        }

        // return pointData;
        return result;
      }),
      tap((result) => {
        // console.log(result.GETLADDERRESULT.length);
        this._ladderResult.next(result.GETLADDERRESULT);
      })
    );

    // return this.http.post<{ SUCCESS : boolean , GETLADDERRESULT : [] }>(
    //   environment.baseURL + 'events/getLadderResult',
    //   body.toString(),
    //   httpOptions
    // ).pipe(
    //   map( result => {
    //     console.log(result.GETLADDERRESULT.length);
    //     const pointData = [];
    //     for(let key in result.GETLADDERRESULT){
    //       console.log(key);
    //       pointData.push(
    //         result.GETLADDERRESULT[key]
    //       )
    //     }

    //     return pointData;
    //   }),
    //   tap( result => {
    //     console.log(result.length);
    //     this._ladderResult.next(result);
    //   } )
    // );
  }

  getLadderResultMicroTierBased_V3(clubDivisionId: string, clientId: string) {
    let body = new URLSearchParams();
    body.set('divisionId', clubDivisionId.toString());
    body.set('masterPersonId', environment.masterPersonId);
    body.set('isRound', '0');
    body.set('clientId', clientId.toString());
    if (this.filterservice.selectedAssociationId) {
      body.set('associationId', this.filterservice.selectedAssociationId);
    }

    return this.userServise.getUser().pipe(
      switchMap((user) => {
        if (user) {
          console.log('person Id - id' + user.personId.toString());
          body.set('person_id', user.personId.toString());
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap((user) => {
        return this.http.post<ResultMicroTierBased_V3>(
          environment.baseURL + 'events/getLadderResultMicroTierBased_V3',
          body.toString(),
          httpOptions
        );
      }),
      map((result) => {
        // const pointData = [];
        // for (let key in result.GETLADDERRESULT) {
        //   console.log(key);
        //   pointData.push(
        //     result.GETLADDERRESULT[key]
        //   )
        // }
        return result;
      }),
      tap((result) => {
        // console.log(result.GETLADDERRESULT.length);
        // this._ladderResult.next(result.GETLADDERRESULT);
      })
    );
  }

  getLadderGame(device_id: string, device_name: string) {
    let body = new URLSearchParams();
    body.set('DeviceKey', device_id);
    body.set('DeviceName', device_name);
    body.set('masterPersonId', environment.masterPersonId);
    body.set('AppName', environment.appName);
    if (this.filterservice.selectedAssociationId) {
      body.set('associationID', this.filterservice.selectedAssociationId);
    }

    return this.userServise.getUser().pipe(
      switchMap((user) => {
        if (user) {
          // console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(() => {
        return this.http.post<GetLadderGame>(
          environment.baseURL + 'teams/getLadderGame',
          body.toString(),
          httpOptions
        );
      }),
      map((result) => {
        // console.log(result);
        return result;
      })
    );
  }
}
