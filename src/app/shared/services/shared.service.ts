import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { httpOptions } from '../api/api-call';
import { HttpClient } from '@angular/common/http';
import { map, tap, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@capacitor/storage';

interface GETASSOCIATIONSETTINGS {
  SUCCESS: true;
  SETTINGS: AssociationSettings;
}

interface AssociationSettings {
  showLiveScores: number;
  showScoringTab: number;
  showLiveStream: number;
  showGradingInLadder: number;
  showImageUploadedScoring: number;
  showReportTextScoring: number;
  showIconUnconnectedUsr: number;
  showTimeResult: number;
  showDraw: number;
  showBestScorer: number;
  welcomeMessageHeader: string;
  welcomeMessageContent: string;
  injuryUrl?: string;
  club_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _lastActiveTab: string = '';

  private _appSettings = new BehaviorSubject<AssociationSettings>({
    showLiveScores: 0,
    showScoringTab: 0,
    showLiveStream: 0,
    showGradingInLadder: 0,
    showImageUploadedScoring: 0,
    showReportTextScoring: 0,
    showIconUnconnectedUsr: 0,
    showTimeResult: 0,
    showDraw: 0,
    showBestScorer: 0,
    welcomeMessageHeader: '',
    welcomeMessageContent: '',
    injuryUrl: '',
    club_id: 0,
  });

  constructor(private http: HttpClient) {}

  get appsettings() {
    // console.log("get app settings...", this._appSettings.value)
    return this._appSettings.asObservable();
  }

  get lastActiveTab() {
    return this._lastActiveTab;
  }

  setLastActiveTab(value: string) {
    this._lastActiveTab = value;
    return;
  }

  setAppSettings(settings: AssociationSettings) {
    // console.log('setAppSettings ....', settings);
    this._appSettings.next(settings);
  }

  getAssociationSettings() {
    let body = new URLSearchParams();
    body.set('app_name', environment.appName);

    return this.http
      .post<GETASSOCIATIONSETTINGS>(
        environment.baseURL + 'teams/AssociationSettings',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          // console.log('App Settings -', result);
          let associationSettings: AssociationSettings = {
            showLiveScores: 0,
            showScoringTab: 0,
            showLiveStream: 0,
            showGradingInLadder: 0,
            showImageUploadedScoring: 0,
            showReportTextScoring: 0,
            showIconUnconnectedUsr: 0,
            showTimeResult: 0,
            showDraw: 0,
            showBestScorer: 0,
            welcomeMessageHeader: '',
            welcomeMessageContent: '',
            injuryUrl: '',
            club_id: 0,
          };
          if (result.SUCCESS) {
            associationSettings.showLiveScores = result.SETTINGS.showLiveScores;
            associationSettings.showScoringTab = result.SETTINGS.showScoringTab;
            associationSettings.showLiveStream = result.SETTINGS.showLiveStream;
            associationSettings.showGradingInLadder =
              result.SETTINGS.showGradingInLadder;
            associationSettings.showImageUploadedScoring =
              result.SETTINGS.showImageUploadedScoring;
            associationSettings.showReportTextScoring =
              result.SETTINGS.showReportTextScoring;
            associationSettings.showIconUnconnectedUsr =
              result.SETTINGS.showIconUnconnectedUsr;
            associationSettings.showTimeResult = result.SETTINGS.showTimeResult;
            associationSettings.showDraw = result.SETTINGS.showDraw;
            associationSettings.showBestScorer = result.SETTINGS.showBestScorer;
            associationSettings.welcomeMessageHeader =
              result.SETTINGS.welcomeMessageHeader;
            associationSettings.welcomeMessageContent =
              result.SETTINGS.welcomeMessageContent;
            associationSettings.injuryUrl = result.SETTINGS.injuryUrl;
            associationSettings.club_id = result.SETTINGS.club_id;
          }
          return associationSettings;
        }),
        tap((result) => {
          this.setAppSettings(result);
        })
      );
  }

  /**
   * Store data to local storage.
   */
  storeData(data, key: string) {
    Storage.set({
      key: key,
      value: JSON.stringify(data),
    }).then(() => {});
  }

  /**
   * Remove data from local storage.
   */
  removeStoredData(key: string) {
    Storage.remove({ key: key }).then(() => {});
  }
}
