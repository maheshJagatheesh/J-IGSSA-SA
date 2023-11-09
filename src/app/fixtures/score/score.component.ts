import { UserService } from 'src/app/shared/user/user.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  PickerController,
  ModalController,
  LoadingController,
  AlertController,
  Platform,
  IonRange,
  ToastController,
} from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { FixtureService, Score, TireBasedScoring } from '../fixture.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface ScoreParam {
  gameType?: number;
  isScoring?: string;
  eventId?: string;
  scoreType?: number;
  liveScoring?: string;
  from?: number;
  riskAssessment?: number | string;
  surveyId?: number | string;
  action?: number; // 1-> Score ,  2-> Survey
  injuryReport?: number | string;
  injurySurvey_id?: number | string;
  homeTeam?: string;
  awayTeam?: string;
  clientId?: number;
  seasonId?: number;
  divisionId?: number;
  roundId?: number;
  isRowingSport?: number;
  isTileEvent?: number;
  categoryId?: number;
}

export enum Action {
  SCORE = 'SCORE',
  SURVEY = 'SURVEY',
}

export interface QA {
  questionId: number;
  answer: number;
  isAnswered: boolean;
  question: string;
  option: Array<{
    survey_option_id: number;
    option_value: number;
    option_label: number;
  }>;
}

export interface InjuryQA {
  questionId: number;
  question_type: number;
  question: string;
  answer: number;
  ansComment: string;
  label: string;
  isAnswered: boolean;
  scale_from: number;
  scale_to: number;
  option: Array<{
    survey_option_id: number;
    option_value: number;
    option_label: string;
  }>;
}

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit, OnChanges, OnDestroy {
  @Input() params: ScoreParam;
  @ViewChild('range') range: IonRange;
  eventId;
  isClicked: boolean;
  isWashout = false;
  radioBtns;
  homeScore = '0';
  awayScore = '0';
  framework = '';
  washout = 0;
  forfiet = 0;
  forfietAway = 0;
  type = 1;
  isFinish = '0';
  scoreCount: number = 1;
  selectedIndex: number = 0;
  isLoading: boolean = true;

  awayScores = [0];
  homeScores = [0];
  reportHome: string = '';
  teamHomeScorer: string = '';
  teamAwayScorer: string = '';
  showBestScorerForm: number = 0;
  rowingEventIds = [];
  rowingHomeScores = [];
  rowingAwayScores = [];
  rowingHomeTeams = [];
  rowingAwayTeams = [];

  bestScorerForm: FormGroup;

  eventStatusName = '';
  imageChoosenURL = '';
  imagePath = '';
  photoToSet: SafeResourceUrl;

  forfeitedHome = 'Forfeited Home';
  washOut = 'Wash Out';
  forfeitedAway = 'Forfeited Away';

  backArrow = 'assets/icon/back.png';
  startStopLiveScore = 'START LIVESCORING';
  showLiveScore: number = 0;
  showImageUploadedScoring: number = 0;
  showReportTextScoring: number = 0;
  backArrowLabel: string = 'FIXTURES';
  screenName: string = 'FINAL SCORE';
  isLiveScoring = 0;

  customPickerOptions: any;
  platFormSubscription: Subscription;

  labels = [];
  gameDetails;

  surveyExists: boolean = false;
  assesmentCompleted: boolean = false;
  surveyQuestions: Array<any> = [];
  questionAnswers: Array<QA>;
  injuryQA: Array<InjuryQA>;
  enableQnSaveBtn: boolean = false;
  enableInjurySaveBtn: boolean = false;
  currentView: number = 1; // 1-> Scoring, 2-> Survey
  subs: Subscription;
  sharedSubs: Subscription;
  personId = '';
  userDataSubscription: Subscription
  constructor(
    private pickerCntrl: PickerController,
    private modalCtrl: ModalController,
    private fixtureService: FixtureService,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private userService: UserService,
  ) {}

  async showPicker(type) {
    let option = [];
    let selected = false;
    let limit = 300;
    let start = 0;
    if (this.params.gameType == 20) {
      limit = 500;
    }

    // if (type == 1) {
    //   limit = this.homeScores[this.selectedIndex] + 20;
    //   if (this.homeScores[this.selectedIndex] && this.homeScores[this.selectedIndex] - 20 > 0) {
    //     start = this.homeScores[this.selectedIndex] - 20
    //   }
    // }
    // else if (type == 2) {
    //   limit = this.awayScores[this.selectedIndex] + 20;
    // }
    // let flag=0
    const increment =this.gameDetails.decimalScoring == 1 ? 0.5 : 1;
    for (let i = 0; i <= limit; i+=increment) {
      option.push({ text: i, value: i });
     
    }
    let opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          // handler: () => console.log('Clicked Save!')
        },
        {
          text: 'Done',
          cssClass: 'wheelBtn',
          handler: () => {
            console.log('Clicked Log. Do not Dismiss.');
            selected = true;
            return true;
          },
        },
      ],
      columns: [
        {
          name: 'options',
          options: option,
        },
      ],
      mode: 'ios',
    };
    let picker = await this.pickerCntrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async (data) => {
      let pic = await picker;
      let col = await picker.getColumn('options');
      this.framework = col.options[col.selectedIndex].text;

      if (selected) {
        // console.log("selected " + selected);
        if (type == '1') {
          // console.log("type " + type);
          if (this.params.isRowingSport || this.params.isTileEvent) {
            this.rowingHomeScores[this.selectedIndex] = +this.framework;
          } else {
            this.homeScore = this.framework;
            this.homeScores[this.selectedIndex] = +this.framework;
          }
        } else if (type == '2') {
          this.awayScore = this.framework;

          this.awayScores[this.selectedIndex] = +this.framework;
        }
      }
    });
  }

  ngOnChanges() {}

  ngOnInit() {
    // console.log("SC -", this.params.action)
    // console.log("params.isTileEvent===", this.params)

    this.view = this.params.action;

    this.bestScorerForm = new FormGroup({
      teamHomeScorer: new FormControl(this.teamHomeScorer, {
        updateOn: 'change',
      }),
      teamAwayScorer: new FormControl(this.teamAwayScorer, {
        updateOn: 'change',
      }),
    });
    let userDataSubscription = this.userService.getUser().subscribe((data) => {
      if(data.personId){
       this.personId = data.personId.toString();      
      } 
    });
  }

  set view(view: number) {
    this.currentView = view;
    if (view == 1) {
      this.setupScoringUI();

      if (Capacitor.isNativePlatform()) {
        FirebaseAnalytics.setCollectionEnabled({
          enabled: true,
        });
        FirebaseAnalytics.setScreenName({
          screenName: 'Scoring',
          nameOverride: 'ScoreComponent',
        })
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      }
    } else if (view == 2) {
      this.setupAssesmentUI();
    } else {
      this.setupInjuryUI();
    }
  }

  get view() {
    return this.currentView;
  }

  changeView(view) {
    this.view = view;
  }

  setupScoringUI() {
    this.checkSurvey();
    this.screenName = this.params.isRowingSport ? 'POINT SCORE' : 'FINAL SCORE';
    this.sharedSubs = this.sharedService.appsettings.subscribe((data) => {
      if (data) {
        this.showLiveScore = data.showLiveScores;
        this.showImageUploadedScoring = data.showImageUploadedScoring;
        this.showReportTextScoring = data.showReportTextScoring;
        this.showBestScorerForm = data.showBestScorer;
      }
    });
    //  this.showLiveScore = environment.liveScoringEnable;

    // if(this.params.from)
    switch (this.params.from) {
      case 1:
        this.backArrowLabel = 'FIXTURES';
        break;
      case 2:
        this.backArrowLabel = 'SCORING';
        break;
    }

    if (this.params.liveScoring == '1') {
      this.isLiveScoring = 1;
      this.screenName = 'LIVE SCORE';
      this.startStopLiveScore = 'CANCEL LIVESCORING';
    }
    this.eventId = this.params.eventId;
    this.backArrow = '/assets/icon/back.png';
    this.isClicked = false;
    this.radioBtns = '';

    for (let i = 1; i < this.params.scoreType; i++) {
      this.homeScores.push(0);
      this.awayScores.push(0);
    }

    if (this.params.isRowingSport || this.params.isTileEvent == 1) {
      this.getEventScoreTireBasedForRowing();
    } else {
      this.getEventScoreTierBased();
    }
    // console.log(this.params);

    this.platFormSubscription = this.platform.backButton.subscribe(() => {
      // navigator['app'].exitApp();
    });
  }

  setupAssesmentUI() {
    // console.log('SC - setupAssesmentUI');
    this.screenName = 'RISK ASSESSMENT';
    this.isLoading = true;
    this.fixtureService.getAssesment(this.params.surveyId).subscribe((data) => {
      this.surveyQuestions = [...data];
      this.questionAnswers = this.surveyQuestions.reduce((acc, crr, idx) => {
        let obj = {
          questionId: crr.questionId,
          answer: 0,
          isAnswered: false,
          question: crr.question,
          option: crr.option,
        };
        acc.push(obj);
        return acc;
      }, []);
      this.isLoading = false;
    });
  }

  setupInjuryUI() {
    // console.log('SC - setupInjuryUI');
    this.screenName = 'INJURY REPORT';
    this.isLoading = true;
    this.fixtureService
      .getAssesment(this.params.injurySurvey_id)
      .subscribe((data) => {
        this.surveyQuestions = [...data];
        this.injuryQA = this.surveyQuestions.reduce((acc, crr, idx) => {
          let obj = {
            questionId: crr.questionId,
            question_type: crr.question_type,
            question: crr.question,
            answer: 0,
            ansComment: '',
            label: '',
            isAnswered: false,
            scale_from: crr.scale_from,
            scale_to: crr.scale_to,
            option: crr.option,
          };
          acc.push(obj);
          return acc;
        }, []);
        this.isLoading = false;
      });
  }

  checkSurvey() {
    if (this.params.riskAssessment === 1 || this.params.riskAssessment === 0) {
      // Survey exists
      this.surveyExists = true;
      if (this.params.riskAssessment === 1) {
        // Survey completed
        this.assesmentCompleted = true;
      } else {
        // Survey incompleted
        this.assesmentCompleted = false;
      }
    } else {
      this.surveyExists = false;
      this.assesmentCompleted = true;
    }
  }

  addAnswer(answer: QA, ansId: number) {
    let index = this.questionAnswers.findIndex(
      (el) => el.questionId == answer.questionId
    );
    this.questionAnswers[index].answer = ansId;
    this.questionAnswers[index].isAnswered = true;

    this.enableQnSaveBtn = this.checkAllAnswered(1);
  }

  addInjuryAnswer(answer: InjuryQA, ansId: number) {
    let index = this.injuryQA.findIndex(
      (el) => el.questionId == answer.questionId
    );
    this.injuryQA[index].answer = ansId;
    this.injuryQA[index].isAnswered = true;
    if (this.injuryQA[index].answer.toLocaleString() === '') {
      this.injuryQA[index].isAnswered = false;
    }

    this.enableInjurySaveBtn = this.checkAllAnswered(2);
  }

  addAnswerComment(answer: InjuryQA, comment: string) {
    let index = this.injuryQA.findIndex(
      (el) => el.questionId == answer.questionId
    );
    this.injuryQA[index].ansComment = comment;
    this.injuryQA[index].isAnswered = true;
    if (this.injuryQA[index].answer.toLocaleString() == '') {
      this.injuryQA[index].isAnswered = false;
    }
    // this.enableInjurySaveBtn = this.checkAllAnswered(2);
  }

  checkAllAnswered(surveyType: number): boolean {
    //surveyType 1- Risk Assesment, 2- Injury Report
    if (surveyType === 2) {
      return this.injuryQA.filter((el) => el.isAnswered == false).length == 0
        ? true
        : false;
    } else {
      return this.questionAnswers.filter((el) => el.isAnswered == false)
        .length == 0
        ? true
        : false;
    }
  }

  saveAnswers() {
    if (this.checkAllAnswered(1)) {
      let param: any = this.questionAnswers.reduce(
        (acc, crr) => {
          acc.answerValues.push(crr.answer);
          acc.questionIds.push(crr.questionId);
          return acc;
        },
        { questionIds: [], answerValues: [] }
      );
      param = {
        ...param,
        surveyId: this.params.surveyId,
        eventId: this.params.eventId,
      };
      // console.log("param-", param)

      this.subs = this.fixtureService.saveSurvey(param).subscribe((data) => {
        if (data.SUCCESS) {
          //Firebase Analytics
          if (Capacitor.isNativePlatform()) {
            FirebaseAnalytics.setCollectionEnabled({
              enabled: true,
            });
            FirebaseAnalytics.logEvent({
              name: 'Risk_assessment_completed',
              params: {
                surveyId: this.params.surveyId,
              },
            })
              .then((res: any) => console.log(res))
              .catch((error: any) => console.error(error));
          }

          this.showAlert('Assessment completed.');
          if (this.params.action === 1) {
            this.params.riskAssessment = 1;
            this.view = 1;
          } else {
            this.onCancel();
          }
        }
      });
    }
  }

  saveInjuryReport() {
    if (this.checkAllAnswered(2)) {
      let param: any = this.injuryQA.reduce(
        (acc, crr) => {
          acc.answerValues.push(crr.answer);
          acc.questionIds.push(crr.questionId);
          acc.answerComment.push(crr.ansComment);
          return acc;
        },
        { questionIds: [], answerValues: [], answerComment: [] }
      );
      param = {
        ...param,
        surveyId: this.params.injurySurvey_id,
        eventId: this.params.eventId,
      };

      this.subs = this.fixtureService.saveSurvey(param).subscribe((data) => {
        if (data.SUCCESS) {
          this.showAlert('Injury report completed.');
          if (this.params.action === 1) {
            this.params.injuryReport = 1;
            this.view = 1;
          } else {
            this.onCancel();
          }
        }
      });
    }
  }

  onChange(event, survey: InjuryQA) {
    this.addInjuryAnswer(survey, event.detail.value);
  }
  onChangeComment(event, survey: InjuryQA) {
    this.addAnswerComment(survey, event.detail.value);
  }

  rangeFn(survey: InjuryQA) {
    let rangeValue = +this.range.value;
    let targetOption: any = survey.option.filter(
      (opt) => opt.option_value === rangeValue
    );
    survey.label = targetOption[0].option_label;
    this.addInjuryAnswer(survey, targetOption[0].survey_option_id);
  }

  onCancel() {
    if (this.platFormSubscription) {
      this.platFormSubscription.unsubscribe();
    }
    this.modalCtrl.dismiss(null, 'cancel');
    this.fixtureService.loadFixtureData.emit(true);
  }

  toggleResultRadioBtn(option) {
    this.isClicked = true;
    this.isWashout = option;
    this.radioBtns = '';
    if (option === 1) {
      this.washout = 0;
      this.forfietAway = 0;
      if (this.forfiet == 1) {
        this.forfiet = 0;
        // this.eventStatusName = '';
      } else {
        this.forfiet = 1;
        // this.eventStatusName = this.forfeitedHome;
      }
    } else if (option === 2) {
      this.forfiet = 0;
      this.forfietAway = 0;
      if (this.washout == 1) {
        this.washout = 0;
        // this.eventStatusName = '';
      } else {
        this.washout = 1;
        // this.eventStatusName = this.washOut;
      }
    } else if (option === 3) {
      this.washout = 0;
      this.forfiet = 0;
      if (this.forfietAway == 1) {
        this.forfietAway = 0;
        //  this.eventStatusName = '';
      } else {
        this.forfietAway = 1;
        // this.eventStatusName = this.forfeitedAway;
      }
    }

    // console.log(
    //   ' washout ' +
    //     this.washout +
    //     ' forfiet ' +
    //     this.forfiet +
    //     ' forfietAway' +
    //     this.forfietAway
    // );
  }

  updateScore(isLiveScoring: any) {
    if (isLiveScoring == '1') {
      this.isFinish = '0';
    } else if (isLiveScoring == '0') {
      this.isFinish = '1';
    }

    if (this.params.gameType == 20) {
      this.finish('1');
    } else {
      // console.log(
      //   'On Save washout ' + this.washout + ' forfiet ' + this.forfiet
      // );

      let score: Score = new Score(
        this.awayScore,
        this.homeScore,
        this.eventId,
        this.forfiet.toString(),
        this.washout.toString(),
        this.forfietAway.toString(),
        this.reportHome,
        this.isFinish,
        this.params.seasonId,
        this.params.clientId,
        this.personId,
      );

      this.loadingController
        .create({ keyboardClose: true, message: 'Updating Score' })
        .then((loadingEl) => {
          loadingEl.present();

          this.fixtureService.updateScore(score).subscribe((data) => {
            loadingEl.dismiss();
            if (data) {
              this.showAlert('Scores updated successfully.');
              this.onCancel();
            }
          });
        });
    }
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

  updateHome(index) {
    this.selectedIndex = index;
    this.showPicker(1);
  }

  updateAway(index) {
    this.selectedIndex = index;
    this.showPicker(2);
  }

  addGame() {
    if (this.params.gameType == 19) {
      if (this.scoreCount < this.params.scoreType) {
        this.scoreCount++;
        this.awayScores.push(0);
        this.homeScores.push(0);
      }
    } else {
      if (this.scoreCount < this.params.scoreType) {
        this.scoreCount++;
        this.awayScores.push(0);
        this.homeScores.push(0);
      }
    }
  }

  finish(isFinish) {
    let tireBasedScoring: TireBasedScoring = new TireBasedScoring(
      this.awayScores,
      this.homeScores,
      this.eventId,
      this.forfiet.toString(),
      this.washout.toString(),
      this.forfietAway.toString(),
      this.reportHome,
      this.imagePath,
      isFinish,
      '',
      '',
      this.params.seasonId,
      this.params.clientId,
      this.personId,
      this.gameDetails.display_reverse_tiers,    
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
              this.onCancel();
            }
          });
      });
  }
  getEventScoreTireBasedForRowing() {
    // console.log('this.params.categoryId--', this.params.categoryId);
    this.isLoading = true;
    this.fixtureService
      .getEventScoreTierBased({
        clientId: this.params.clientId,
        divisionId: this.params.divisionId,
        roundId: this.params.roundId,
        isTileEvent: this.params.isTileEvent,
        categoryId: this.params.categoryId,
      })
      .subscribe(
        (data) => {
          this.gameDetails = data[0];
          [...this.labels] = [
            this.gameDetails.homeAwayScoreLabel,
            this.gameDetails.homeAwayT2ScoreLabel,
            this.gameDetails.homeAwayT3ScoreLabel,
            this.gameDetails.homeAwayT4ScoreLabel,
            this.gameDetails.homeAwayT5ScoreLabel,
            this.gameDetails.homeAwayT6ScoreLabel,
            this.gameDetails.homeAwayT7ScoreLabel,
            this.gameDetails.homeAwayT8ScoreLabel,
            this.gameDetails.homeAwayT9ScoreLabel,
            this.gameDetails.homeAwayT10ScoreLabel,
            this.gameDetails.homeAwayT11ScoreLabel,
          ];

          for (const [i, row] of data.entries()) {
            this.rowingEventIds[i] = +row.eventID;
            this.rowingHomeTeams[i] = row.homeTeamName;
            this.rowingAwayTeams[i] = row.awayTeamName;
            if (
              (row.simpleAwayScore.toString().trim().length &&
                +row.simpleAwayScore >= 0) ||
              this.params.scoreType == 1
            ) {
              this.rowingAwayScores[i] = row.simpleAwayScore
                ? +row.simpleAwayScore
                : 0;
            }
            if (
              (row.simpleHomeScore.toString().trim().length &&
                +row.simpleHomeScore >= 0) ||
              this.params.scoreType == 1
            ) {
              this.homeScore = row.simpleHomeScore;
              this.rowingHomeScores[i] = row.simpleHomeScore
                ? +row.simpleHomeScore
                : 0;
            }
          }

          let game = data[0];
          if (
            game.simpleHomeScore.toString().trim().length &&
            +game.simpleHomeScore >= 0
          ) {
            this.homeScores[0] = +game.simpleHomeScore;
          }
          if (
            game.tier2HomeScore.toString().trim().length &&
            +game.tier2HomeScore >= 0
          ) {
            this.homeScores[1] = +game.tier2HomeScore;
          }
          if (
            game.tier3HomeScore.toString().trim().length &&
            +game.tier3HomeScore >= 0
          ) {
            this.homeScores[2] = +game.tier3HomeScore;
          }
          if (
            game.tier4HomeScore.toString().trim().length &&
            +game.tier4HomeScore >= 0
          ) {
            this.homeScores[3] = +game.tier4HomeScore;
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  getEventScoreTierBased() {
    this.isLoading = true;
    this.fixtureService
      .getEventScoreTierBased({ eventId: this.params.eventId })
      .subscribe(
        (data) => {
          this.gameDetails = data[0];
          [...this.labels] = [
            this.gameDetails.homeAwayScoreLabel,
            this.gameDetails.homeAwayT2ScoreLabel,
            this.gameDetails.homeAwayT3ScoreLabel,
            this.gameDetails.homeAwayT4ScoreLabel,
            this.gameDetails.homeAwayT5ScoreLabel,
            this.gameDetails.homeAwayT6ScoreLabel,
            this.gameDetails.homeAwayT7ScoreLabel,
            this.gameDetails.homeAwayT8ScoreLabel,
            this.gameDetails.homeAwayT9ScoreLabel,
            this.gameDetails.homeAwayT10ScoreLabel,
            this.gameDetails.homeAwayT11ScoreLabel,
          ];
          let game = data[0];
          if (
            game.simpleAwayScore.toString().trim().length &&
            +game.simpleAwayScore >= 0
          ) {
            this.scoreCount++;
            this.awayScore = game.simpleAwayScore;
            this.awayScores[0] = +game.simpleAwayScore;
          }

          if (
            game.simpleHomeScore.toString().trim().length &&
            +game.simpleHomeScore >= 0
          ) {
            this.homeScore = game.simpleHomeScore;
            this.homeScores[0] = +game.simpleHomeScore;
          }

          if (
            game.tier2AwayScore.toString().trim().length &&
            +game.tier2AwayScore >= 0
          ) {
            this.scoreCount++;
            // this.awayScores.push(0);
            this.awayScores[1] = +game.tier2AwayScore;
          }

          if (
            game.tier2HomeScore.toString().trim().length &&
            +game.tier2HomeScore >= 0
          ) {
            // this.homeScores.push(0);
            this.homeScores[1] = +game.tier2HomeScore;
          }

          if (
            game.tier3AwayScore.toString().trim().length &&
            +game.tier3AwayScore >= 0
          ) {
            this.scoreCount++;
            // this.awayScores.push(0);
            this.awayScores[2] = +game.tier3AwayScore;
          }

          if (
            game.tier3HomeScore.toString().trim().length &&
            +game.tier3HomeScore >= 0
          ) {
            // this.homeScores.push(0);
            this.homeScores[2] = +game.tier3HomeScore;
          }

          if (
            game.tier4AwayScore.toString().trim().length &&
            +game.tier4AwayScore >= 0
          ) {
            this.scoreCount++;
            // this.awayScores.push(0);
            this.awayScores[3] = +game.tier4AwayScore;
          }

          if (
            game.tier4HomeScore.toString().trim().length &&
            +game.tier4HomeScore >= 0
          ) {
            // this.homeScores.push(0);
            this.homeScores[3] = +game.tier4HomeScore;
          }

          if (game.reportHome.toString().trim().length) {
            this.reportHome = game.reportHome;
          } else {
            this.reportHome = '';
          }

          if (game.imageName) {
            this.imageChoosenURL = environment.logoImgPath + game.imageName;
          } else {
            this.imageChoosenURL = '';
          }

          if (game.eventStatusName.toString().trim().length) {
            this.eventStatusName = game.eventStatusName;

            if (game.eventStatusName == this.forfeitedHome) {
              this.forfiet = 1;
              this.washout = 0;
              this.forfietAway = 0;
            } else if (game.eventStatusName == this.washOut) {
              this.forfiet = 0;
              this.washout = 1;
              this.forfietAway = 0;
            } else if (game.eventStatusName == this.forfeitedAway) {
              this.forfiet = 0;
              this.washout = 0;
              this.forfietAway = 1;
            }
          } else {
            this.eventStatusName = '';
          }

          this.isLoading = false;
          this.teamHomeScorer = game.home_best_player;
          this.teamAwayScorer = game.away_best_player;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  toggleLiveScore() {
    let msg = 'Enabling Live Score';
    if (this.params.liveScoring == '1') {
      msg = 'Disabling Live Score';
    }
    this.loadingController
      .create({ keyboardClose: true, message: msg })
      .then((loadingEl) => {
        loadingEl.present();
        if (this.params.liveScoring == '1') {
          this.fixtureService
            .cancelLiveScoring('0', this.params.eventId)
            .subscribe(
              (data) => {
                loadingEl.dismiss();
                this.params.liveScoring = '0';
                this.startStopLiveScore = 'START LIVESCORING';
                // console.log('cancelled data response', data);
              },
              (error) => {
                // console.log('error in cancelling live score', error);
                loadingEl.dismiss();
              }
            );
        } else {
          this.fixtureService.setEventLive(this.params.eventId).subscribe(
            (data) => {
              // if (this.params.liveScoring == '1') {
              //   this.params.liveScoring = '0';
              //   this.startStopLiveScore = 'START LIVESCORING';
              //   this.cancellingLiveScore('0', this.params.eventId);
              // } else {
              this.params.liveScoring = '1';
              this.startStopLiveScore = 'CANCEL LIVESCORING';
              // }
              loadingEl.dismiss();
            },
            (error) => {
              loadingEl.dismiss();
            }
          );
        }

        // loadingEl.present();
        // this.fixtureService.setEventLive(this.params.eventId).subscribe(
        //   data => {
        //     if (this.params.liveScoring == '1') {
        //       this.params.liveScoring = '0';
        //       this.startStopLiveScore = 'START LIVESCORING';
        //       this.cancellingLiveScore('0', this.params.eventId);
        //     } else {
        //       this.params.liveScoring = '1';
        //       this.startStopLiveScore = 'CANCEL LIVESCORING';
        //     }
        //     loadingEl.dismiss();
        //   }, error => {
        //     loadingEl.dismiss();
        //   }
        // )
      });
  }

  finishGame() {}

  cancellingLiveScore(liveScoring, eventid) {
    this.fixtureService
      .cancelLiveScoring(liveScoring, eventid)
      .subscribe((data) => {
        // console.log('cancelled data response', data);
      });
  }

  onCameraClicked() {
    alert('Camera Clicked');
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64,
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    this.imagePath = image.base64String;
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    // console.log('fileURL', imageUrl);
    // console.log('URLType', typeof imageUrl);

    this.photoToSet = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );

    if (this.imagePath != null) {
      this.imageChoosenURL = 'data:image/jpeg;base64,' + this.imagePath;
      // this.getBase64File(this.imageChoosenURL);
      // console.log('imageURL', this.imageChoosenURL);
    } else {
      this.imagePath = '';
    }

    // return imageUrl;
    // imageElement.src = imageUrl;
  }

  onCloseClicked() {
    this.imageChoosenURL = '';
    // alert('Close');
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    if (this.sharedSubs) {
      this.sharedSubs.unsubscribe();
    }
    this.userDataSubscription.unsubscribe();
  }

  showConfirmModal(isFinish) {
    if (this.showBestScorerForm) {
      this.setupScoreParams(
        isFinish,
        this.bestScorerForm.value.teamHomeScorer,
        this.bestScorerForm.value.teamAwayScorer
      );
    } else {
      this.setupScoreParams(isFinish, '', '');
    }
  }

  async setupScoreParams(isFinish, teamHomeScorer, teamAwayScorer) {
    if (this.params.isRowingSport == 1 || this.params.isTileEvent == 1) {
      let rowingWashout = [];
      let rowingForfeiteHome = [];
      let rowingForfeiteAway = [];
      let rowingReportAway = [];
      let rowingReportHome = [];
      let rowingIsFinish = [];
      let rowingImage = [];
      let rowingDocument = [];
      let rowingHome_best_player = [];
      let rowingAway_best_player = [];
      for (let i = 0; i < this.rowingEventIds.length; i++) {
        rowingWashout.push(this.washout);
        rowingForfeiteHome.push(0);
        rowingForfeiteAway.push(0);
        rowingReportHome.push(this.reportHome);
        rowingReportAway.push('');
        rowingIsFinish.push(isFinish);
        rowingImage.push(this.imagePath);
        rowingDocument.push('');
        rowingHome_best_player.push('');
        rowingAway_best_player.push('');
        
      }
      const scoreParams = {
        isRowing: this.params.isRowingSport,
        isTileEvent: this.params.isTileEvent,
        labels: this.labels,
        rowingEventId: this.rowingEventIds,
        rowingHomeScore: this.rowingHomeScores,
        rowingAwayScore: this.rowingAwayScores,
        rowingHomeTeams: this.rowingHomeTeams,
        rowingAwayTeams: this.rowingAwayTeams,
        rowingWashout: rowingWashout,
        rowingForfeiteHome: rowingForfeiteHome,
        rowingForfeiteAway: rowingForfeiteAway,
        rowingReportAway: rowingReportAway,
        rowingReportHome: rowingReportHome,
        rowingIsFinish: rowingIsFinish,
        rowingImage: rowingImage,
        rowingDocument: rowingDocument,
        rowingHome_best_player: rowingHome_best_player,
        rowingAway_best_player: rowingAway_best_player,
        display_reverse_tiers: this.gameDetails.display_reverse_tiers,
        seasonId: this.params.seasonId,
        clientId: this.params.clientId,
      };      
      this.openModal(scoreParams);
    } else {
      const scoreParams = {
        isRowing: this.params.isRowingSport,
        labels: this.labels,
        homeScores: this.homeScores,
        awayScores: this.awayScores,
        homeTeam: this.params.homeTeam,
        awayTeam: this.params.awayTeam,
        eventId: this.eventId,
        forfiet: this.forfiet.toString(),
        washout: this.washout.toString(),
        forfietAway: this.forfietAway.toString(),
        reportHome: this.reportHome,
        imagePath: this.imagePath,
        isFinish: isFinish,
        homeBestPlayer: teamHomeScorer,
        awayBestPlayer: teamAwayScorer,
        display_reverse_tiers: this.gameDetails.display_reverse_tiers,
        seasonId: this.params.seasonId,
        clientId: this.params.clientId,
      };
      this.openModal(scoreParams);
    }
  }

  async openModal(scoreParams) {
    const modal = await this.modalCtrl.create({
      component: ConfirmModalComponent,
      cssClass: 'modalCss',
      componentProps: {
        scoreParams: scoreParams,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.onCancel();
      }
    });
    return await modal.present();
  }

  showTest() {
    // console.log('showtest');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: 'ion-text-center',
    });
    toast.present();
  }
}
