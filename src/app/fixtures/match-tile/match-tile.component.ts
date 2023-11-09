import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModalController, ToastController } from '@ionic/angular';
import { ScoreComponent } from '../score/score.component';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@ionic-native/launch-navigator/ngx';
import { FixtureService } from '../fixture.service';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-match-tile',
  templateUrl: './match-tile.component.html',
  styleUrls: [
    './match-tile.component.scss',
    '../match-list/match-list.component.scss',
  ],
})
export class MatchTileComponent implements OnInit {
  @Input() events;
  @Input() clientName;
  @Input() divisionName;
  @Input() isLogedIn;
  @Input() eventDiplayType;

  showMap = false;
  isLoading: boolean;
  homeTeamLogo: string;
  awayTeamLogo: string;
  imgBaseUrl = environment.logoImgPath;

  /**
   * Live Scoring
   */
  isLiveScoring: boolean;
  isStreamUrlEnabled: boolean;
  liveStreaming_url: string;

  lat;
  long;

  zoom: number = 16;
  surveyExists: boolean = false;
  enableRiskAssesment: boolean = false;
  mvenueMapExists: boolean = false;
  svenueMapExists: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private nativeGeocoder: NativeGeocoder,
    private launchNavigator: LaunchNavigator,
    private fixtureService: FixtureService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.imgBaseUrl = environment.logoImgPath;
    this.isLiveScoring = false;
    this.isStreamUrlEnabled = false;
    this.liveStreaming_url = null;

    if (
      this.events.eventByCatData[0] &&
      this.events.eventByCatData[0].isLiveScoring &&
      this.events.eventByCatData[0].liveStreaming_url.trim().length
    ) {
      // alert(this.events.eventByCatData[0].liveStreaming_url)
      this.isStreamUrlEnabled = true;
    }
  }

  ngOnChanges() {
    this.enableRiskAssesment = false;
    this.surveyExists = false;
    // this.events.eventByCatData[0].riskAssessment = 0
    if (
      this.events.eventByCatData[0] &&
      (this.events.eventByCatData[0].riskAssessment === 1 ||
        this.events.eventByCatData[0].riskAssessment === 0)
    ) {
      this.surveyExists = true;
      if (this.events.eventByCatData[0].riskAssessment === 0) {
        // Survey exists but not answered.
        this.enableRiskAssesment = true;
      }
    }
    // console.log("fixture", this.events.eventByCatData[0].riskAssessment)
  }

  toggleMapView() {
    if (!!this.events.eventByCatData[0].latitude && !!this.events.eventByCatData[0].longitude) {
      this.mvenueMapExists = true;
    }
    if (!!this.events.eventByCatData[0]?.subvenue_latitude && !!this.events.eventByCatData[0]?.subvenue_longitude) {
      this.svenueMapExists = true;
    }
    if (this.events.eventByCatData[0].event_address.length == 0 && !this.svenueMapExists && !this.mvenueMapExists) {
      return;
    }
    this.showMap = !this.showMap;

    
    if (this.showMap) {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };
      if (this.mvenueMapExists) {
        this.lat = this.events.eventByCatData[0].latitude;
        this.long = this.events.eventByCatData[0].longitude;    
        this.isLoading = false;
      }  else if (this.svenueMapExists) {
        this.lat = this.events.eventByCatData[0]?.subvenue_latitude;
        this.long = this.events.eventByCatData[0]?.subvenue_longitude;    
        this.isLoading = false;
      } else {    
        this.fixtureService
          .forwardgeocoder(
            '',
            '',
            this.events.eventByCatData[0]?.event_address,
            this.events.eventByCatData[0]?.ground_suburb,
            this.events.eventByCatData[0]?.event_state,
            this.events.eventByCatData[0]?.event_postcode,
            this.events.eventByCatData[0]?.ground_country
          )
          .subscribe(
            (data) => {
              // console.log(data);
              this.lat = +data.lat;
              this.long = +data.lng;
              this.isLoading = false;
            },
            (error) => {
              // alert("error")
              this.isLoading = false;
            }
          );
      }
      console.log(this.lat, this.long, 'latlong')
    }
  }

  launchGoogleMap() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.logEvent({
        name: 'Map_direction',
        params: {
          event_address: this.events.eventByCatData[0].event_address,
        },
      })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }
    // this.launchNavigator.navigate(this.events.eventByCatData[0].event_address)
    
    if(this.svenueMapExists || this.mvenueMapExists){
      let destination = [this.lat, this.long];
      this.launchNavigator
      .navigate(
        destination
      )
      .then(
        (success) => console.log('Launched navigator'),
        (error) => console.log('Error launching navigator', error)
      );
    } else {
      let address = this.events.eventByCatData[0].event_address;
      if(this.events.eventByCatData[0].ground_suburb.length){
        address = address + `,+${this.events.eventByCatData[0].ground_suburb}`;
      }
      if(this.events.eventByCatData[0].event_state.length){
        address = address + `,+${this.events.eventByCatData[0].event_state}`;
      }
      if(this.events.eventByCatData[0].event_postcode.length){
        address = address + `,+${this.events.eventByCatData[0].event_postcode}`;
      }
      if(this.events.eventByCatData[0].ground_country.length){
        address = address + `,+${this.events.eventByCatData[0].ground_country}`;
      }
      this.launchNavigator
      .navigate(
        address
      )
      .then(
        (success) => console.log('Launched navigator'),
        (error) => console.log('Error launching navigator', error)
      );
    }   
  }


  async openLiveStreamURL() {
    const reg =
      '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$';
    if (this.events.eventByCatData[0].liveStreaming_url.match(reg)) {
      await Browser.open({
        url: this.events.eventByCatData[0].liveStreaming_url,
      });
    } else {
      this.presentToast('Invalid URL');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  openScoreModal(type: number) {
    this.modalCtrl
      .create({
        component: ScoreComponent,
        componentProps: {
          params: {
            gameType: this.events.eventByCatData[0].sport_id,
            isScoring: 1,
            eventId: this.events.eventByCatData[0].event_id,
            scoreType: this.events.eventByCatData[0].scoreType,
            liveScoring: this.events.eventByCatData[0].isLiveScoring,
            from: 1,
            riskAssessment: this.events.eventByCatData[0].riskAssessment,
            surveyId: this.events.eventByCatData[0].survey_id,
            action: type,
            injuryReport: this.events.eventByCatData[0].injuryReport,
            injurySurvey_id: this.events.eventByCatData[0].injurySurvey_id,
            homeTeam: this.events.eventByCatData[0].teamhome_name,
            awayTeam: this.events.eventByCatData[0].teamaway_name,
            clientId: this.events.eventByCatData[0].client_id,
            divisionId: this.events.eventByCatData[0].division_id,
            roundId: this.events.eventByCatData[0].round,
            isRowingSport:
              this.events.eventByCatData[0].client_name == 'Rowing' ? 1 : 0,
            isTileEvent: 1,
            categoryId: this.events.category_id,
          },
        },
        // componentProps: { }
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }
}
