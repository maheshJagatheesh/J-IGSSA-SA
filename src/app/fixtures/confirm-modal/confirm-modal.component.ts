import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import {
  ModalController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import {
  FixtureService,
  TireBasedScoring,
  RowingTireBasedScoring,
} from '../fixture.service';
import { UserService } from 'src/app/shared/user/user.service';

export interface ScoreParms {
  labels?: string[];
  homeScores?: number[];
  awayScores?: number[];
  homeTeam?: string;
  awayTeam?: string;
  eventId?: string;
  forfiet?: string;
  washout?: string;
  forfietAway?: string;
  reportHome?: string;
  imagePath?: string;
  isFinish?: string;
  homeBestPlayer?: string;
  awayBestPlayer?: string;

  isRowing?: number;
  isTileEvent?: number;
  seasonId?: number;
  clientId?: number;
  rowingEventId?: number[];
  rowingHomeScore?: number[];
  rowingAwayScore?: number[];
  rowingHomeTeams?: string[];
  rowingAwayTeams?: string[];
  rowingWashout?: number[];
  rowingForfeiteHome?: number[];
  rowingForfeiteAway?: number[];
  rowingReportAway?: string[];
  rowingReportHome?: string[];
  rowingIsFinish?: number[];
  rowingImage?: string[];
  rowingDocument?: string[];
  rowingHome_best_player?: string[];
  rowingAway_best_player?: string[];
  display_reverse_tiers: any;
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  @Input() scoreParams: ScoreParms;
  @Input() pmodalCtrl;
  personId = '';
  userDataSubscription: Subscription
  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private fixtureService: FixtureService,
    private alertCtrl: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    let userDataSubscription = this.userService.getUser().subscribe((data) => {
      if(data.personId){
       this.personId = data.personId.toString();      
      } 
    });
  }

  finish() {
    if (this.scoreParams.isRowing == 1 || this.scoreParams.isTileEvent == 1) {
      let rowingTireBasedScoring: RowingTireBasedScoring =
        new RowingTireBasedScoring(
          this.scoreParams.rowingEventId,
          this.scoreParams.rowingHomeScore,
          this.scoreParams.rowingAwayScore,
          this.scoreParams.rowingWashout,
          this.scoreParams.rowingForfeiteHome,
          this.scoreParams.rowingForfeiteAway,
          this.scoreParams.rowingReportAway,
          this.scoreParams.rowingReportHome,
          this.scoreParams.rowingIsFinish,
          this.scoreParams.rowingImage,
          this.scoreParams.rowingDocument,
          this.scoreParams.rowingHome_best_player,
          this.scoreParams.rowingAway_best_player,
        );

      this.loadingController
        .create({ keyboardClose: true, message: 'Updating Score' })
        .then((loadingEl) => {
          loadingEl.present();

          this.fixtureService
            .saveScore(rowingTireBasedScoring)
            .subscribe((data) => {
              loadingEl.dismiss();
              if (data) {
                this.showAlert('Scores updated successfully.');
                if (Capacitor.isNativePlatform()) {
                  FirebaseAnalytics.setCollectionEnabled({
                    enabled: true,
                  });
                  FirebaseAnalytics.logEvent({
                    name: 'Score_saved',
                    params: {
                      event_id: rowingTireBasedScoring.eventId[0],
                    },
                  })
                    .then((res: any) => {})
                    .catch((error: any) => console.error(error));
                }
                this.onSuccess();
              }
            });
        });
    } else {
      let tireBasedScoring: TireBasedScoring = new TireBasedScoring(
        this.scoreParams.awayScores,
        this.scoreParams.homeScores,
        this.scoreParams.eventId,
        this.scoreParams.forfiet.toString(),
        this.scoreParams.washout.toString(),
        this.scoreParams.forfietAway.toString(),
        this.scoreParams.reportHome,
        this.scoreParams.imagePath,
        this.scoreParams.isFinish,
        this.scoreParams.homeBestPlayer,
        this.scoreParams.awayBestPlayer,
        this.scoreParams.seasonId,
        this.scoreParams.clientId,
        this.personId,
        this.scoreParams.display_reverse_tiers,
      );

      this.loadingController
        .create({ keyboardClose: true, message: 'Updating Score' })
        .then((loadingEl) => {
          loadingEl.present();

          this.fixtureService
            .updateScoreTireBased(tireBasedScoring)
            .subscribe((data) => {
              loadingEl.dismiss();
              if (data) {
                this.showAlert('Scores updated successfully.');
                if (Capacitor.isNativePlatform()) {
                  FirebaseAnalytics.setCollectionEnabled({
                    enabled: true,
                  });
                  FirebaseAnalytics.logEvent({
                    name: 'Score_saved',
                    params: {
                      event_id: tireBasedScoring.event_id,
                    },
                  })
                    .then((res: any) => {})
                    .catch((error: any) => console.error(error));
                }
                this.onSuccess();
              }
            });
        });
    }
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onSuccess() {
    this.modalCtrl.dismiss(true, 'success');
  }

  showAlert(message: string) {
    return this.alertCtrl
      .create({
        header: 'Success',
        message: message,
        buttons: [
          {
            text: 'Okay',
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  ngOnDestroy(){
    this.userDataSubscription.unsubscribe();
  }
}
