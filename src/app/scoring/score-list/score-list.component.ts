import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScoreComponent } from 'src/app/fixtures/score/score.component';
import { ConfirmPopupComponent } from 'src/app/results/confirm-popup/confirm-popup.component';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss'],
})
export class ScoreListComponent implements OnInit {

  @Input() fixture;
  @Input() isLogedIn;
  @Input() eventDiplayType;
  @Input() clientName;
  @Input() divisionName;
  imgBaseUrl = environment.logoImgPath;
  showMap;
  resultList;
  showLabel = false;
  showAcceptProtestSign: number = 0;
  showTileDisplay: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private sharedService: SharedService
  ) { }

  ngOnInit() {

    if(this.eventDiplayType && this.eventDiplayType.toLowerCase() == 'tile') this.showTileDisplay = true;
    else this.showTileDisplay = false

    if (this.fixture.isFixture == 0) {
      this.resultList = {
        sportName: this.fixture.sportName,

        sportId: this.fixture.sportName,
        sportFlag: this.fixture.sportName,
        clientName: "Basketball",
        clientID: 559,
        eventGroup: [this.fixture]
      }
      // console.log("this.resultList", this.resultList);

    }

    this.sharedService.appsettings.subscribe(

      data => {

        this.showAcceptProtestSign = data.showIconUnconnectedUsr;
      }
    )


  }

  showScoring() {
    // console.log(this.fixture, ' fixture ::: ');

    this.modalCtrl.create({
      component: ScoreComponent,
      // componentProps: { params: { 'gameType': this.fixture.scoreFlag, 'isScoring': 1, 'eventId': this.fixture.event_id } }
      componentProps: {
        params: {
          // 'gameType': this.fixture.sportId, 
          // 'isScoring': 1, 
          // 'eventId': this.fixture.event_id 
          'gameType': this.fixture.sportId,
          'isScoring': 1,
          'eventId': this.fixture.event_id,
          'scoreType': this.fixture.scoreType,
          'liveScoring': this.fixture.isLiveScoring,
          'from': 2,
          'riskAssessment': this.fixture.riskAssessment,
          'surveyId': this.fixture.survey_id,
          'action': 1,
          'injuryReport': this.fixture.injuryReport,
          'injurySurvey_id': this.fixture.injurySurvey_id,
          'homeTeam': this.fixture.teamhome_name,
          'awayTeam': this.fixture.teamaway_name,
          'clientId': this.fixture.client_id,
          'seasonId': this.fixture.seasonId,
          'divisionId': this.fixture.division_id,
          'roundId': this.fixture.round,
          'isRowingSport': this.fixture.client_name == "Rowing"? 1: 0
        }
      }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  showTileEventScoring(event) {
    // console.log(event, ' fixture ::: ');
    if(event.length && !event[0].scoreFlag){
      this.modalCtrl.create({
        component: ScoreComponent,
        // componentProps: { params: { 'gameType': event.scoreFlag, 'isScoring': 1, 'eventId': event.event_id } }
        componentProps: {
          params: {
            // 'gameType': event.sportId, 
            // 'isScoring': 1, 
            // 'eventId': event.event_id 
            'gameType': event[0].sportId,
            'isScoring': 1,
            'eventId': event[0].event_id,
            'scoreType': event[0].scoreType,
            'liveScoring': event[0].isLiveScoring,
            'from': 2,
            'riskAssessment': event[0].riskAssessment,
            'surveyId': event[0].survey_id,
            'action': 1,
            'injuryReport': event[0].injuryReport,
            'injurySurvey_id': event[0].injurySurvey_id,
            'homeTeam': event[0].teamhome_name,
            'awayTeam': event[0].teamaway_name,
            'clientId': event[0].client_id,
            'divisionId': event[0].division_id,
            'roundId': event[0].round,
            'isRowingSport': event[0].client_name == "Rowing"? 1: 0,
            'isTileEvent': this.showTileDisplay? 1: 0,
            'categoryId': this.fixture.category_id
          }
        }
      })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
    }

  }


  openScoreModal() {

    // .then(resultData => {
    //   console.log(resultData);
    // })

  }

  protest(eventId) {
    console.log("protest" + eventId)
    this.modalCtrl.create({
      component: ConfirmPopupComponent,
      cssClass: 'modalCss',
      componentProps: { eventId: eventId, acceptProtest: 1 }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  accept(eventId) {
    console.log("accept" + eventId)
    this.modalCtrl.create({
      component: ConfirmPopupComponent,
      cssClass: 'modalCss',
      componentProps: { eventId: eventId, acceptProtest: 0 }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

}
