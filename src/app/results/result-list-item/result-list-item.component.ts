import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModalController, ToastController } from '@ionic/angular';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';
import { ResultsService } from '../results.service';
import { from, Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-result-list-item',
  templateUrl: './result-list-item.component.html',
  styleUrls: ['./result-list-item.component.scss'],
})
export class ResultListItemComponent implements OnInit, OnDestroy {
  @Input() resulList;
  @Input() showLabel;
  @Input() isLogedIn;
  imgBaseUrl = environment.logoImgPath;
  showTirebasedDiv: boolean;
  showSportLabel: boolean = true;

  /**
   * Live Scoring
   */
  isLiveScoring: boolean;
  isStreamUrlEnabled: boolean;
  liveStreaming_url: string;

  showTimeStarted: number = 1;
  showAcceptProtestSign: number = 0;
  subs: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private resultsService: ResultsService,
    private toastController: ToastController,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.subs = this.sharedService.appsettings.subscribe((data) => {
      if (data.showTimeResult.toString.length) {
        this.showTimeStarted = data.showTimeResult;
      }
      this.showAcceptProtestSign = data.showIconUnconnectedUsr;
    });

    this.resultsService.showsportName = true;
    if (!this.resultsService.showEventDate) {
      if (this.resulList.clientName == this.resultsService.previousSport) {
        this.resultsService.showsportName = false;
      }
    }

    this.showTirebasedDiv = true;
    this.showSportLabel = this.resultsService.showsportName;
    this.isStreamUrlEnabled = true;

    const divisions = this.resulList.eventGroup
      .map((item) => ({
        homeDivisionName: item.homeDivisionName,
        homeAwayScoreLabel: item.homeAwayScoreLabel.toString().length
          ? item.homeAwayScoreLabel
          : 'Pt',
      }))
      .filter((value, index, self) => {
        return (
          self
            .map((mapObj) => mapObj['homeDivisionName'])
            .indexOf(value['homeDivisionName']) === index
        );
      });

    const eventName = this.resulList.eventGroup
      .map((item) => item.awayTeamName)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.resulList.divisions = divisions;
    this.resulList.eventName = eventName[0];
  }

  ionViewWillEnter() {
    this.imgBaseUrl = environment.logoImgPath;
  }

  protest(eventId) {
    console.log('protest' + eventId);
    this.modalCtrl
      .create({
        component: ConfirmPopupComponent,
        cssClass: 'modalCss',
        componentProps: { eventId: eventId, acceptProtest: 1 },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  accept(eventId) {
    console.log('accept' + eventId);
    this.modalCtrl
      .create({
        component: ConfirmPopupComponent,
        cssClass: 'modalCss',
        componentProps: { eventId: eventId, acceptProtest: 0 },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  async openLiveStreamURL(urlToLoad) {
    const reg =
      '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$';
    if (urlToLoad.match(reg)) {
      await Browser.open({ url: urlToLoad });
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

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
