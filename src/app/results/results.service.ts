import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { ResultModel } from '../Model/Results/Result.model';

import { environment } from '../../environments/environment';
import { tap, switchMap, map, take } from 'rxjs/operators';
import { ResultList } from '../Model/Results/ResultList.model';

import { httpOptions } from '../shared/api/api-call'
import { UserService } from '../shared/user/user.service';
import { FilterModel } from '../Model/Filter/Filter.model';
import { FilterService } from '../shared/Filter/filter.service';

interface NotificationResponse{
  SUCCESS:boolean,
  SENDPUSHNOTIFICATIONCOACH: NotificationData
  
}
 interface NotificationData{
  
  message: string,
  status: boolean,
  isSentRec: string,
  isNotsentrec: string,
  totaldevices: string
  
}

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(
    private http: HttpClient,
    private userServise: UserService,
    private filterservice: FilterService
  ) { }

  private _resultData = new BehaviorSubject<any[]>([]);
  loadResult = new EventEmitter<boolean>();
  previousDate: string = null;
  previousSport: string = null;
  showsportName: boolean = true;
  showEventDate: boolean = true;

  get resultData() {
    return this._resultData.asObservable();
  }

  /* Load Result Data  */
  getResultData(eventMonth: string, eventYear: string, deviceId: string, deviceName: string, loadFavourite, offset) {
    let body = new URLSearchParams();
    body.set('eventMonth', eventMonth);
    body.set('eventYear', eventYear);
    body.set('Client_ids', JSON.stringify(this.filterservice.selectedSports));
    body.set('Gamerounds', JSON.stringify(this.filterservice.selectedRounds));
    body.set('Division_ids', JSON.stringify(this.filterservice.selectedDivision));
    body.set('Club_ids', JSON.stringify(this.filterservice.selectedSchools));
    body.set('favouriteTeamIds', JSON.stringify(this.filterservice.selectedFavourites));
    body.set('DeviceKey', deviceId);
    body.set('DeviceName', deviceName);
    body.set('loadFavourite', loadFavourite);
    body.set('masterPersonId', environment.masterPersonId);
    body.set('offset', offset);
    body.set('AppName', environment.appName);

    if (this.filterservice.selectedAssociationId) {
      body.set('associationID', this.filterservice.selectedAssociationId);
    }

    return this.userServise.getUser().pipe(
      take(1),
      switchMap(user => {
        if (user) {
          console.log("person Id - id" + user.personId.toString());
          body.set('person_id', user.personId.toString());
        }
        return this.userServise.getUser();
      }),
      take(1),
      switchMap(user => {
        return this.http.post<ResultList>(
          environment.baseURL + 'events/getResultListTierBased',
          body.toString(),
          httpOptions
        )
      }),
      map(result => {
        const resultList = [];
        if (result.hasOwnProperty('SUCCESS') && !result.SUCCESS) {
          return null;
        }

        if (result.hasOwnProperty('GETRESULTLIST')) {
          let length = result.GETRESULTLIST.length;
          for (let key in result.GETRESULTLIST) {
            resultList.push(
              new ResultModel(
                result.GETRESULTLIST[key].dateHeader,
                result.GETRESULTLIST[key].gameGroup
              )
            )
          }
        }

        return {
          resultList: resultList,
          filter: new FilterModel(
            result.GETFILTERTEAMLIST,
            result.DIVISIONLIST,
            result.SCHOOLLIST,
            result.ROUNDLIST,
            result.SPORTSLIST
          ),
          totalRecords: result.TOTALRECORDS,
          fetchRecords: result.FETCHRECORDS,
          currentRows: result.CURRENTROWS
        };
      }),
      tap(data => {
        this._resultData.next(data.resultList);
        // this.filterservice._filterData.next(data.filter);
        // this.filterservice.loadFilter.emit({ flag: true, page: 2 });

        this.filterservice.setFilterData(
          {
            favouriteTeamList: data.filter.favouriteTeamList,
            divivsionList: data.filter.divivsionList,
            schoolList: data.filter.schoolList,
            roundList: data.filter.roundList,
            sportList: data.filter.sportList
          }
        );
      })
    )
  }

  /* Load Result Data by Division */
  getResultListByDivision(division_id, offset) {
    let body = new URLSearchParams();
    body.set('division_id', division_id);
    body.set('masterPersonId', environment.masterPersonId);
    body.set('offset', offset);

    return this.http.post<ResultList>(
      environment.baseURL + 'events/getResultListByDivisionTierBased',
      body.toString(),
      httpOptions
    ).pipe(
      map(result => {
        const resultList = [];
        if (result.hasOwnProperty('SUCCESS') && !result.SUCCESS) {
          return null;
        }

        if (result.hasOwnProperty('GETRESULTLIST')) {
          for (let key in result.GETRESULTLIST) {
            resultList.push(
              new ResultModel(
                result.GETRESULTLIST[key].dateHeader,
                result.GETRESULTLIST[key].gameGroup
              )
            )
          }
        }
        return {
          resultList,
          totalRecords: result.TOTALRECORDS,
          fetchRecords: result.FETCHRECORDS,
          currentRows: result.CURRENTROWS
        };
      }),
      tap(data => {
        this._resultData.next(data.resultList);
      })
    )
  }

  /* Accept or Protest score  */
  acceptOrProtest(acceptProtest: string, eventId: string) {
    let body = new URLSearchParams();
    body.set('acceptProtest', acceptProtest);
    body.set('eventId', eventId);
    return this.http.post<{ SUCCESS: boolean, UPDATEACCEPTPROTESTBYAWAY: boolean }>(
      environment.baseURL + 'events/updateAcceptProtestByAway',
      body.toString(),
      httpOptions
    ).pipe(
      map(data => {
        return data;
      })
    )
  }

  sendNotificationToCoach(isProtest: string, eventID: string) {

    let body = new URLSearchParams();
    body.set('IsProtest',isProtest);
    body.set('Event_id',eventID);
    body.set('App_name',environment.appName);

    return this.userServise.getUser().pipe(

      take(1),
      switchMap(user =>{

        if (user) {
          body.set('Person_id',JSON.stringify(user.personId));
        }
        return this.userServise.getUser()
      }),
      take(1),
      switchMap(user => {

        return this.http.post<NotificationResponse>(
          environment.baseURL + 'push/sendPushNotificationCoach',
          body.toString(),
          httpOptions).pipe(
          map(data => {
            return data;
          })
        )
      }),map(data =>{

        if(data.SUCCESS){

          console.log('COACH NOTIFICATION SUCCESS');
          return data.SENDPUSHNOTIFICATIONCOACH;
        }else{

          console.log('COACH NOTIFICATION FAILURE');
          // alert('FAILURE');
        }
      })

    )

  }

}
