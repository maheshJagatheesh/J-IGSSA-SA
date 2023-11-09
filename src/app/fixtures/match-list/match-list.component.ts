import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent implements OnInit, OnChanges {
  @Input() fixture;
  @Input() draw;
  @Input() isLogedIn;
  @Input() eventDiplayType;
  showMap = false;
  showBottomSection = false;
  isLoading: boolean;
  homeTeamLogo: string;
  awayTeamLogo: string;
  imgBaseUrl = environment.logoImgPath;
  hideRound: boolean = false;
  showTileDisplay: boolean = false;
  mvenueMapExists: boolean = false;
  svenueMapExists: boolean = false;

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

    if (this.eventDiplayType && this.eventDiplayType.toLowerCase() == 'tile')
      this.showTileDisplay = true;
    else this.showTileDisplay = false;

    if (
      this.fixture.gameRound &&
      (this.fixture.gameRound == 'Pre' || this.fixture.gameRound == 0)
    ) {
      this.hideRound = true;
    }
    if (
      this.fixture &&
      this.fixture.isLiveScoring &&
      this.fixture.liveStreaming_url.trim().length
    ) {
      // alert(this.fixture.liveStreaming_url)
      this.isStreamUrlEnabled = true;
    }
  }

  ngOnChanges() {
    this.enableRiskAssesment = false;
    this.surveyExists = false;
    // this.fixture.riskAssessment = 0
    if (
      this.fixture &&
      (this.fixture.riskAssessment === 1 || this.fixture.riskAssessment === 0)
    ) {
      this.surveyExists = true;
      if (this.fixture.riskAssessment === 0) {
        // Survey exists but not answered.
        this.enableRiskAssesment = true;
      }
    }
    // console.log("fixture", this.fixture.riskAssessment)
  }

  ionViewWillEnter() {}

  toggleMapView() {
    this.showBottomSection = !this.showBottomSection;
    if (!!this.fixture.latitude && !!this.fixture.longitude) {
      this.mvenueMapExists = true;
    }
    if (!!this.fixture?.subvenue_latitude && !!this.fixture?.subvenue_longitude) {
      this.svenueMapExists = true;
    }
    if (this.fixture.event_address.length == 0 && !this.svenueMapExists && !this.mvenueMapExists) {
      this.isLoading = false;
      return;
    }
    this.showMap = !this.showMap;

    
    if (this.showMap) {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };
      if (this.mvenueMapExists) {
        this.lat = this.fixture.latitude;
        this.long = this.fixture.longitude;    
        this.isLoading = false;
      }  else if (this.svenueMapExists) {
        this.lat = this.fixture?.subvenue_latitude;
        this.long = this.fixture?.subvenue_longitude;    
        this.isLoading = false;
      } else {    
        this.fixtureService
          .forwardgeocoder(
            '',
            '',
            this.fixture?.event_address,
            this.fixture?.ground_suburb,
            this.fixture?.event_state,
            this.fixture?.event_postcode,
            this.fixture?.ground_country
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

        // if (this.fixture.latitude.length == 0 || this.fixture.longitude.length == 0) {
        //   console.log("this.fixture.event_address ---", this.fixture.event_address);
        //   this.nativeGeocoder.forwardGeocode(this.fixture.event_address, options)
        //     .then(
        //       (result: NativeGeocoderResult[]) => {
        //         console.log("Goecoder --- result ", result);
        //         this.fixture.latitude = result[0].latitude;
        //         this.fixture.longitude = result[0].longitude;

        //         this.lat = +result[0].latitude;
        //         this.long = +result[0].longitude;

        //         console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude)

        //         this.isLoading = false;
        //       }
        //     )
        //     .catch((error: any) => {
        //       console.log("Error --- Goecoder" + error);
        //       this.lat = +'';
        //       this.long = +'';
        //       this.isLoading = false;
        //     });
        // }
      }
      console.log(this.lat, this.long, 'latlong')
    }
  }

  openScoreModal(type: number) {
    this.modalCtrl
      .create({
        component: ScoreComponent,
        componentProps: {
          params: {
            gameType: this.fixture.sport_id,
            isScoring: 1,
            seasonId: this.fixture.seasonId,
            eventId: this.fixture.event_id,
            scoreType: this.fixture.scoreType,
            liveScoring: this.fixture.isLiveScoring,
            from: 1,
            riskAssessment: this.fixture.riskAssessment,
            surveyId: this.fixture.survey_id,
            action: type,
            injuryReport: this.fixture.injuryReport,
            injurySurvey_id: this.fixture.injurySurvey_id,
            homeTeam: this.fixture.teamhome_name,
            awayTeam: this.fixture.teamaway_name,
            clientId: this.fixture.client_id,
            divisionId: this.fixture.division_id,
            roundId: this.fixture.round,
            isRowingSport: this.fixture.client_name == 'Rowing' ? 1 : 0,
          },
        },
        // componentProps: { }
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  launchGoogleMap() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.logEvent({
        name: 'Map_direction',
        params: {
          event_address: this.fixture.event_address,
        },
      })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }
    // this.launchNavigator.navigate(this.fixture.event_address)
    
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
      let address = this.fixture.event_address;
      if(this.fixture.ground_suburb.length){
        address = address + `,+${this.fixture.ground_suburb}`;
      }
      if(this.fixture.event_state.length){
        address = address + `,+${this.fixture.event_state}`;
      }
      if(this.fixture.event_postcode.length){
        address = address + `,+${this.fixture.event_postcode}`;
      }
      if(this.fixture.ground_country.length){
        address = address + `,+${this.fixture.ground_country}`;
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
    if (this.fixture.liveStreaming_url.match(reg)) {
      await Browser.open({ url: this.fixture.liveStreaming_url });
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
}
