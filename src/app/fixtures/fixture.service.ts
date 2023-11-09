import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FixtureDetails } from '../Model/fixtureDetails.model';
import { DrawDetails } from '../Model/fixtureDetails.model';
import { tap, switchMap, map, take } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { httpOptions } from '../shared/api/api-call';

import { FixtureModel } from '../Model/Fixture.model';
import { DrawModel } from '../Model/Draw.model';
import {
  FilterModel,
  DivivsionList,
  SchoolList,
  RoundList,
  SportList,
} from '../Model/Filter/Filter.model';
import { FilterService } from '../shared/Filter/filter.service';
import { UserService } from '../shared/user/user.service';
import {
  CompetitionFilterService,
  competitionFilterConst,
} from '../shared/components/competition-filter/competition-filter.service';

export interface GetEventScore {
  success: boolean;
  GETGAMESCORE: EventScore[];
}
export interface EventScore {
  tier3AwayScore: any;
  reportHome: any;
  tier5HomeScore: any;
  eventName: any;
  tier7HomeScore: any;
  eventStatusName: any;
  eventID: any;
  tier2HomeScore: any;
  simpleHomeScore: any;
  reportAway: any;
  tier8AwayScore: any;
  shortEventStatus: any;
  tier4AwayScore: any;
  tier3HomeScore: any;
  tier6HomeScore: any;
  eventStatusID: any;
  tier7AwayScore: any;
  tier5AwayScore: any;
  simpleAwayScore: any;
  tier4HomeScore: any;
  tier2AwayScore: any;
  tier8HomeScore: any;
  tier6AwayScore: any;
  imageName: any;
  home_best_player: any;
  away_best_player: any;
  homeTeamName: any;
  awayTeamName: any;
}

export class Score {
  constructor(
    public away: string,
    public home: string,
    public event_id: string,
    public forfeit: string,
    public washout: string,
    public forfeitAway: string,
    public reportHome: string,
    public isFinish: string,
    public seasonId?: number,
    public clientId?: number,
    public personId?: string,
  ) {}
}
export class TireBasedScoring {
  constructor(
    public away: number[],
    public home: number[],
    public event_id: string,
    public forfeit: string,
    public washout: string,
    public forfeitAway: string,
    public reportHome: string,
    public image?: string,
    public isFinish?: string,
    public homeBestPlayer?: string,
    public awayBestPlayer?: string,
    public seasonId?: number,
    public clientId?: number,
    public personId?: string,
    public display_reverse_tiers?:number,
  ) {}
}

export class RowingTireBasedScoring {
  constructor(
    public eventId: number[],
    public homeScore: number[],
    public awayScore: number[],
    public washout: number[],
    public forfeiteHome: number[],
    public forfeiteAway: number[],
    public reportAway: string[],
    public reportHome: string[],
    public isFinish: number[],
    public image: string[],
    public document: string[],
    public home_best_player: string[],
    public away_best_player: string[],
    public seasonId?: number,
    public clientId?: number,
    public personId?: string,
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class FixtureService {
  constructor(
    private http: HttpClient,
    private filterservice: FilterService,
    private userServise: UserService,
    private competitionFilterService: CompetitionFilterService
  ) {}

  private _fixtureList = new BehaviorSubject<FixtureModel[]>([]);
  private _drawList = new BehaviorSubject<DrawModel[]>([]);

  loadFixtureData = new EventEmitter<boolean>();
  filter = new EventEmitter<FilterModel>();
  isDrawTabEnabled = new BehaviorSubject<boolean>(false);
  // filterChanged = new EventEmitter<{ flag: boolean, page: number}>();

  previousDateSchedule: string = null;

  get fixtureList() {
    return this._fixtureList.asObservable();
  }

  get drawList() {
    return this._drawList.asObservable();
  }

  setIsDrawTabEnabled(value: boolean) {
    return this.isDrawTabEnabled.next(value);
  }

  get DrawTabEnabled() {
    return this.isDrawTabEnabled.asObservable();
  }

  getDrawList(device_id: string, device_name: string, loadFavourite, offset) {
    let body = new URLSearchParams();
    body.set('clientTimeZone', '');
    body.set('eventDate', '');
    body.set(
      'favouriteTeamIds',
      JSON.stringify(this.filterservice.selectedFavourites)
    );
    body.set('Client_ids', JSON.stringify(this.filterservice.selectedSports));
    body.set('Gamerounds', JSON.stringify(this.filterservice.selectedRounds));
    body.set(
      'Division_ids',
      JSON.stringify(this.filterservice.selectedDivision)
    );
    body.set('Club_ids', JSON.stringify(this.filterservice.selectedSchools));
    body.set('DeviceKey', device_id);
    body.set('DeviceName', device_name);
    body.set('loadFavourite', loadFavourite);
    body.set('masterPersonId', environment.masterPersonId);
    body.set('offset', offset);
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
      switchMap((user) => {
        return this.http.post<DrawDetails>(
          environment.baseURL + 'events/getDrawListTierBased',
          body.toString(),
          httpOptions
        );
      }),
      map((result) => {
        // console.log("draw result===", result)
        const drawList = [];
        if (result.hasOwnProperty('GETFIXTURELIST')) {
          for (let key in result.GETFIXTURELIST) {
            drawList.push(
              new DrawModel(
                result.GETFIXTURELIST[key].round,
                result.GETFIXTURELIST[key].Draw_data
              )
            );
          }

          return {
            drawList: drawList,
            filter: new FilterModel(
              result.GETFILTERTEAMLIST,
              result.GETFILTERDIVISIONLIST,
              result.GETFILTERSCHOOLLIST,
              result.GETFILTERROUNDLIST,
              result.GETFILTERSPORTLIST
            ),
            totalRecords: result.TOTALRECORDS,
            fetchRecords: result.FETCHRECORDS,
            currentRows: result.CURRENTROWS,
          };
        }
      }),
      take(1),
      tap(
        (drawList) => {
          this._drawList.next(drawList.drawList);

          this.filterservice.setFilterData({
            favouriteTeamList: drawList.filter.favouriteTeamList,
            divivsionList: drawList.filter.divivsionList,
            schoolList: drawList.filter.schoolList,
            roundList: drawList.filter.roundList,
            sportList: drawList.filter.sportList,
          });
          this.filterservice.settestSub(1);
          if (loadFavourite === 1) {
            // for (let fav of drawList.filter.favouriteTeamList) {
            //   console.log(fav);
            //   this.filterservice.selectedFavourites.push(fav.favouriteTeamId);
            // }
          }
          // this.filterservice.loadFilter.emit({ flag: true, page: 1 });
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  getFixtureList(
    device_id: string,
    device_name: string,
    loadFavourite,
    offset
  ) {
    let body = new URLSearchParams();
    body.set('clientTimeZone', '');
    body.set('eventDate', '');
    body.set(
      'favouriteTeamIds',
      JSON.stringify(this.filterservice.selectedFavourites)
    );
    body.set('Client_ids', JSON.stringify(this.filterservice.selectedSports));
    body.set('Gamerounds', JSON.stringify(this.filterservice.selectedRounds));
    body.set(
      'Division_ids',
      JSON.stringify(this.filterservice.selectedDivision)
    );
    body.set('Club_ids', JSON.stringify(this.filterservice.selectedSchools));
    body.set('DeviceKey', device_id);
    body.set('DeviceName', device_name);
    body.set('loadFavourite', loadFavourite);
    body.set('masterPersonId', environment.masterPersonId);
    body.set('offset', offset);
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
      switchMap((user) => {
        return this.http.post<FixtureDetails>(
          environment.baseURL + 'events/getFixtureListTierBased',
          body.toString(),
          httpOptions
        );
      }),
      map((result) => {
        const fixtureList = [];
        if (result.hasOwnProperty('GETFIXTURELIST')) {
          for (let key in result.GETFIXTURELIST) {
            fixtureList.push(
              new FixtureModel(
                result.GETFIXTURELIST[key].date_schedule,
                result.GETFIXTURELIST[key].fixture_details,
                result.GETFIXTURELIST[key].EVENTDISPLAYTYPE
              )
            );
          }

          return {
            fixtureList: fixtureList,
            filter: new FilterModel(
              result.GETFILTERTEAMLIST,
              result.GETFILTERDIVISIONLIST,
              result.GETFILTERSCHOOLLIST,
              result.GETFILTERROUNDLIST,
              result.GETFILTERSPORTLIST
            ),
            totalRecords: result.TOTALRECORDS,
            fetchRecords: result.FETCHRECORDS,
            currentRows: result.CURRENTROWS,
          };
        }
      }),
      take(1),
      tap(
        (fixtureList) => {
          this._fixtureList.next(fixtureList.fixtureList);

          this.filterservice.setFilterData({
            favouriteTeamList: fixtureList.filter.favouriteTeamList,
            divivsionList: fixtureList.filter.divivsionList,
            schoolList: fixtureList.filter.schoolList,
            roundList: fixtureList.filter.roundList,
            sportList: fixtureList.filter.sportList,
          });
          this.filterservice.settestSub(1);
          if (loadFavourite === 1) {
            // for (let fav of fixtureList.filter.favouriteTeamList) {
            //   console.log(fav);
            //   this.filterservice.selectedFavourites.push(fav.favouriteTeamId);
            // }
          }
          // this.filterservice.loadFilter.emit({ flag: true, page: 1 });
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  updateScore(score: Score) {
    let body = new URLSearchParams();
    body.set('eventId', score.event_id);
    body.set('homescore', score.home);
    body.set('awayscore', score.away);
    body.set('forfeit', score.forfeit);
    body.set('washout', score.washout);
    body.set('forfeitAway', score.forfeitAway);
    body.set('reportHome', score.reportHome);
    body.set('isFinish', score.isFinish);
    body.set('adminId', score.personId);
    body.set('clientId', score.clientId.toString());
    body.set('seasonId', score.seasonId.toString());

    return this.http
      .post<FixtureDetails>(
        environment.baseURL + 'events/saveGameScoreTierBased',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  saveScore(score: RowingTireBasedScoring) {
    // console.log
    let body = new URLSearchParams();
    body.set('eventId', JSON.stringify(score.eventId));
    body.set('homeScore', JSON.stringify(score.homeScore));
    body.set('awayScore', JSON.stringify(score.awayScore));
    body.set('washout', JSON.stringify(score.washout));
    body.set('forfeiteHome', JSON.stringify(score.forfeiteHome));
    body.set('forfeiteAway', JSON.stringify(score.forfeiteAway));
    body.set('reportAway', JSON.stringify(score.reportAway));
    body.set('reportHome', JSON.stringify(score.reportHome));
    body.set('isFinish', JSON.stringify(score.isFinish));
    body.set('image', JSON.stringify(score.image));
    body.set('document', JSON.stringify(score.document));
    body.set('home_best_player', JSON.stringify(score.home_best_player));
    body.set('away_best_player', JSON.stringify(score.away_best_player));

    return this.http
      .post<FixtureDetails>(
        environment.baseURL + 'events/saveEventsScoreTierBased',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  updateScoreTireBased(score: TireBasedScoring) {
    const body = new URLSearchParams();
    body.set('eventId', score.event_id);
    body.set('forfeiteHome', score.forfeit);
    body.set('washout', score.washout);
    body.set('forfeiteAway', score.forfeitAway);
    body.set('reportHome', score.reportHome);
    body.set('home_best_player', score.homeBestPlayer);
    body.set('away_best_player', score.awayBestPlayer);
    body.set('adminId', score.personId);
    body.set('clientId', score.clientId.toString());
    body.set('seasonId', score.seasonId.toString());
    if (score.isFinish) {
      body.set('isFinish', score.isFinish);
    }
    if (score.image) {
      body.set('image', score.image);
    }
    if(score.display_reverse_tiers == 1){
      for (let i = 0; i < score.away.length; i++) {
        const value = score.away.length - 1 - i;
        switch (i) {
          case 0:
            body.set('homescore', score.home[value].toString());
            body.set('awayscore', score.away[value].toString());
            break;
          case 1:
            body.set('tier2homeScore', score.home[value].toString());
            body.set('tier2AwayScore', score.away[value].toString());
            break;
          case 2:
            body.set('tier3homeScore', score.home[value].toString());
            body.set('tier3AwayScore', score.away[value].toString());
            break;
          case 3:
            body.set('tier4homeScore', score.home[value].toString());
            body.set('tier4AwayScore', score.away[value].toString());
            break;
          case 4:
            body.set('tier5homeScore', score.home[value].toString());
            body.set('tier5AwayScore', score.away[value].toString());
            break;
        }
      }
    } else {
      for (let i = 0; i < score.away.length; i++) {
        switch (i) {
          case 0:
            body.set('homescore', score.home[i].toString());
            body.set('awayscore', score.away[i].toString());
            break;
          case 1:
            body.set('tier2homeScore', score.home[i].toString());
            body.set('tier2AwayScore', score.away[i].toString());
            break;
          case 2:
            body.set('tier3homeScore', score.home[i].toString());
            body.set('tier3AwayScore', score.away[i].toString());
            break;
          case 3:
            body.set('tier4homeScore', score.home[i].toString());
            body.set('tier4AwayScore', score.away[i].toString());
            break;
          case 4:
            body.set('tier5homeScore', score.home[i].toString());
            body.set('tier5AwayScore', score.away[i].toString());
            break;
        }
      }
    }
    

    // console.log('saveScore', body.toString());

    return this.http
      .post<FixtureDetails>(
        environment.baseURL + 'events/saveGameScoreTierBased',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  /* -- Forward GeoCoder */
  forwardgeocoder(
    field_name: string,
    ground_name: string,
    eventAddress: string,
    groundSubUrb: string,
    event_state: string,
    event_postcode: string,
    groundCountry: string
  ) {
    let address = [];
    if(field_name.length){
      address.push(field_name);
    }
    if(ground_name.length){
     address.push(ground_name);
    }
    if(eventAddress.length){
     address.push(eventAddress);
    }
    if(groundSubUrb.length){
     address.push(groundSubUrb);
    }
    if(event_state.length){
     address.push(event_state);
    }
    if(event_postcode.length){
     address.push(event_postcode);
    }
    if(groundCountry.length){
     address.push(groundCountry);
    } else {
      address.push('Australia');
    }
    // address = 'hi'
    let addressString = '';
    addressString = address.toString()
    console.log('address', address)
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}+&key=${environment.googleMapApiKey}`
      )
      .pipe(
        take(1),
        map((data) => {          
          return data.results[0].geometry.location;          
        })
      );
  }

  /**
   * events/getEventScoreTierBased
   */
  getEventScoreTierBased(param) {
    // console.log(param)
    let body = new URLSearchParams();
    if (param.eventId) {
      body.set('eventId', param.eventId);
    } else {
      body.set('clientId', param.clientId);
      body.set('divisionId', param.divisionId);
      body.set('roundId', param.roundId);
      if (param.isTileEvent === 1) {
        body.set('categoryId', param.categoryId);
      }
    }
    // body.set('eventId', '101655');
    return this.http
      .post<GetEventScore>(
        environment.baseURL + 'events/getEventScoreTierBased',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          return result.GETGAMESCORE;
        })
      );
  }

  setEventLive(eventId) {
    let body = new URLSearchParams();
    body.set('eventId', eventId);
    return this.http
      .post<any>(
        environment.baseURL + 'events/setEventLive',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          return result.GETGAMESCORE;
        })
      );
  }

  cancelLiveScoring(liveScoring, eventID) {
    const urlParams = new URLSearchParams();
    urlParams.set('liveScoring', liveScoring);
    urlParams.set('eventid', eventID);
    return this.http
      .post<any>(
        environment.baseURL + 'events/setCancelLiveScoring',
        urlParams.toString(),
        httpOptions
      )
      .pipe(
        map((cancelData) => {
          // console.log('cancel Data', cancelData);
        })
      );
  }

  getAssesment(surveyId) {
    let body = new URLSearchParams();
    body.set('surveyId', surveyId.toString());
    return this.http
      .post<any>(
        environment.baseURL + 'events/getCoachSurvey',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          return result.SURVEYQUESTION;
        })
      );
  }

  // getInjuryQuestions(injurySurvey_id) {
  //   let body = new URLSearchParams();
  //   body.set('survey_id', injurySurvey_id.toString());
  //   return this.http.post<any>(
  //     environment.baseURL + 'events/getCoachSurvey',
  //     body.toString(),
  //     httpOptions
  //   ).pipe(
  //     map(result => {
  //       return result.SURVEYQUESTION;
  //     })
  //   )
  // }

  saveSurvey(params) {
    let body = new URLSearchParams();
    body.set('surveyId', params.surveyId);
    body.set('eventId', params.eventId);
    body.set('questionIds', JSON.stringify(params.questionIds));
    body.set('answerValues', JSON.stringify(params.answerValues));
    return this.http
      .post<any>(
        environment.baseURL + 'players/saveSurvey',
        body.toString(),
        httpOptions
      )
      .pipe(tap((el) => console.log('Sucess---')));
  }
}
