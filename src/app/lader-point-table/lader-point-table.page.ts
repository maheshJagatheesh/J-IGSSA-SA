import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LaderService, ResultMicroTierBased_V3 } from '../laders/lader.service';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  LoadingController,
  MenuController,
} from '@ionic/angular';
import { environment } from '../../environments/environment';

import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SharedService } from '../shared/services/shared.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-lader-point-table',
  templateUrl: './lader-point-table.page.html',
  styleUrls: ['./lader-point-table.page.scss'],
})
export class LaderPointTablePage implements OnInit, AfterViewInit {
  ponitTable = [];
  isLoading = false;
  imgBaseUrl = environment.logoImgPath;
  divisionDetails;
  isPortrait: boolean;
  // isPortrait = true;
  window: any;
  showElement = true;
  logo: string = '';

  grading: any;
  finalScore: any;
  competition: any;

  labelFinal;
  labelComputation;
  labelGrading;

  resultMicroTierBased;
  ladderHeaders;
  columnHeaderKeys;
  isGradingShowing: number = 0;

  clientId: any = null;

  constructor(
    private ladderService: LaderService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private screenOrientation: ScreenOrientation,
    private menu: MenuController,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.appsettings.subscribe((data) => {
      this.isGradingShowing = data.showGradingInLadder;
    });

    this.isPortrait = true;

    // console.log('Orientation ' + this.screenOrientation.type);

    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = null;
      // console.log(paramMap);
      if (!paramMap.has('laderId') || !paramMap.has('clientId')) {
        this.navCtrl.navigateBack('/home/tabs/lader');
        return;
      }
      // this.loadResultData(paramMap.get('laderId'));
      this.getLadderResultMicroTierBased_V3(
        paramMap.get('laderId'),
        paramMap.get('clientId')
      );
      this.clientId = paramMap.get('clientId');
      // this.getLadderResultMicroTierBased_V3(4434, 146);
      // console.log('ladder-id ' + paramMap.get('laderId'));
    });

    // this.screenOrientation.onChange().subscribe(
    //   () => {
    //     console.log("Orientation Changed " + this.screenOrientation.type);
    //   }
    // );
  }

  ngAfterViewInit() {
    // this.screenOrientation.onChange().subscribe(
    //   () => {
    //     console.log("Orientation Changed After view");
    //   }
    // );
  }

  changeOrientation() {
    this.isPortrait = false;
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  ionViewWillEnter() {
    this.resultMicroTierBased = [];
    this.ladderHeaders = [];
    this.columnHeaderKeys = [];
    this.menu.enable(false);
    // console.log("Inside: ionViewWillEnter");
    if (Capacitor.isNativePlatform()) {
      this.screenOrientation.unlock();
    }

    this.showElement = true;
    setTimeout(() => {
      console.log('hide');
      this.showElement = false;
    }, 2000);

    window.addEventListener('orientationchange', (_) => {
      if (Capacitor.isNativePlatform()) {
        if (
          this.screenOrientation.type ==
            this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY ||
          this.screenOrientation.type ==
            this.screenOrientation.ORIENTATIONS.PORTRAIT_SECONDARY
        ) {
          this.isPortrait = true;
          // alert("portrait");

          // console.log('Change orientation. PORTRAIT_PRIMARY' + this.screenOrientation.type);
          // this.isPortrait = true;
          // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
          // this.screenOrientation.unlock();
          // alert("rotate PORTRAIT_PRIMARY " + this.isPortrait);
        } else {
          // alert("Landscape");
          this.isPortrait = false;
          // this.changeOrientation();
          // this.isPortrait = false;

          // console.log('Change orientation. LANDSCAPE ' + this.screenOrientation.type);
          // this.isPortrait = false;
          // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
          // this.screenOrientation.unlock();
          // if (this.showElement) {
          //   this.showElement = false;
          // }
          // alert("rotate LANDSCAPE " + this.isPortrait);
        }
      }
    });
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.setScreenName({
        screenName: 'Ladder_details',
        nameOverride: 'LaderPointTablePage',
      })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }
  }

  ionViewDidLoad() {
    // console.log('Inside: ionViewDidLoad');
  }

  loadResultData(clubDivisionId) {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: '' })
      .then((loadingEl) => {
        loadingEl.present();

        this.ladderService
          .loadLadderResult(clubDivisionId.toString())
          .subscribe((data) => {
            this.isLoading = false;
            loadingEl.dismiss();
            // console.log(data.GETLADDERRESULT.length);
            // console.log(data);
            this.ponitTable = data.GETLADDERRESULT;
            this.divisionDetails = data.CLUBLOGO[0];

            this.grading = data.GETLADDERRESULTGRADING;
            this.finalScore = data.GETLADDERRESULTFINAL;
            this.competition = data.GETLADDERRESULT;

            this.labelFinal = data.GETLADDERRESULTFINALTITLE;
            this.labelComputation = data.GETLADDERRESULTTITLE;
            this.labelGrading = data.GETLADDERRESULTGRADINGTITLE;

            if (data.CLUBLOGO[0].sportBanner.length) {
              this.logo = data.CLUBLOGO[0].sportBanner;
            } else if (data.CLUBLOGO[0].bannerImage.length) {
              this.logo = data.CLUBLOGO[0].bannerImage;
            } else if (data.CLUBLOGO[0].clientLogo.length) {
              this.logo = data.CLUBLOGO[0].clientLogo;
            }
          });
      });
  }

  getLadderResultMicroTierBased_V3(division_id, client_id) {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: '' })
      .then((loadingEl) => {
        loadingEl.present();
        this.ladderService
          .getLadderResultMicroTierBased_V3(
            division_id.toString(),
            client_id.toString()
          )
          .subscribe((data) => {
            // console.log(data);
            loadingEl.dismiss();
            if (data.GETLADDERRESULT.length) {
              this.resultMicroTierBased = data.GETLADDERRESULT[0];
              this.ladderHeaders = data.GETLADDERRESULT[1];
              this.columnHeaderKeys = data.GETLADDERRESULT[1].reduce(
                (acc, crr, ci) => {
                  acc[ci] = crr.databaseColumn;
                  return acc;
                },
                []
              );
            } else {
              this.resultMicroTierBased = [];
              this.ladderHeaders = [];
              this.columnHeaderKeys = [];
            }
            this.isLoading = false;
          });
      });
  }

  ionViewWillLeave() {
    if (Capacitor.isNativePlatform()) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  // calcWinningPercent(win, loss) {

  // }
  calcWinningPercent = (win, loss) => {
    if (loss == 0) {
      return win;
    } else {
      return win / loss;
    }
  };
}
