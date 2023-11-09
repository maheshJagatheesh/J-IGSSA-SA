import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MenuController, IonInfiniteScroll } from '@ionic/angular';
import { ResultsService } from './results.service';
import { ResultModel } from '../Model/Results/Result.model';
import { error, promise } from 'protractor';
import { FilterService } from '../shared/Filter/filter.service';
import { DeviceService } from '../shared/device/device.service';
import { Subscription } from 'rxjs';
import { CompetitionFilterService } from '../shared/components/competition-filter/competition-filter.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login/login.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  perPage: number;
  recordCount: number;
  offset: number;
  itemsLoaded: number;
  loadFilter: boolean;
  resultData: ResultModel[] = [];
  isLoading: boolean;
  competitionSubscription: Subscription;
  loadResultSubscription: Subscription;
  selectedFilterDataSubs: Subscription;
  reloadAfterAcceptProtest: Subscription;
  routeSubscription: Subscription;
  filterSubscription: Subscription;
  loginSubscription: Subscription;

  isLogedIn = false;

  constructor(
    private menuCntrl: MenuController,
    private resultService: ResultsService,
    private filterService: FilterService,
    private deviceService: DeviceService,
    private competitionFilterService: CompetitionFilterService,
    private routes: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.loadFilter = false;
    // this.reloadAfterAcceptProtest = this.resultService.loadResult.subscribe(data => {
    //   if (data) {
    //     this.offset = 0;
    //     this.loadFilter = true;
    //     this.resultData = [];
    //     this.isLoading = true;
    //     this.loadResult(0).then(() => {
    //       this.isLoading = false;
    //     });
    //   }
    // })

    // this.filterService.filterChanged.subscribe(data => {
    //   if (data && data.page == 2) {
    //     console.log("--- api after filter updated --");
    //     // this.toggleFilter();
    //     this.offset = 0;
    //     this.loadFilter = true;
    //     this.resultData = [];
    //     this.isLoading = true;
    //     this.loadResult(0).then(() => {
    //       this.isLoading = false;
    //     });

    //   }
    // })
  }

  toggleFilter() {
    // console.log(this.menuCntrl.isEnabled.toString());
    this.menuCntrl.toggle();
  }

  ionViewWillEnter() {
    // this.loadResult(1);
    // this.resultData = [];
    this.resultService.previousDate = null;
    this.resultService.previousSport = null;

    this.filterService.setPage(2);
    this.offset = 0;
    this.isLoading = true;
    this.menuCntrl.enable(true);

    this.loginSubscription = this.loginService.isUserLogedIn.subscribe(
      (isLogedIn) => {
        this.isLogedIn = isLogedIn;
      }
    );

    this.routeSubscription = this.routes.params.subscribe((data) => {
      if (data && data.teamId) {
        this.filterService.setSelectedFavourites(data.teamId);
      } else {
        this.loadResult(0).then(() => {
          this.isLoading = false;
        });
      }
    });

    this.reloadAfterAcceptProtest = this.resultService.loadResult.subscribe(
      (data) => {
        if (data) {
          this.offset = 0;
          this.loadFilter = true;
          this.resultData = [];
          this.isLoading = true;
          this.loadResult(0).then(() => {
            this.isLoading = false;
          });
        }
      }
    );

    this.filterSubscription = this.filterService.filterChanged.subscribe(
      (data) => {
        if (data && data.page == 2) {
          // console.log('--- api after filter updated --');
          // this.toggleFilter();
          this.offset = 0;
          this.loadFilter = true;
          this.resultData = [];
          this.isLoading = true;
          this.loadResult(0).then(() => {
            this.isLoading = false;
          });
        }
      }
    );

    this.competitionSubscription =
      this.competitionFilterService.subAssociationFilterSelected.subscribe(
        (data) => {
          if (data) {
            this.filterService.clearFilter();
            this.offset = 0;
            this.loadFilter = true;
            this.resultData = [];
            this.isLoading = true;
            this.loadResult(0).then(() => {
              this.isLoading = false;
            });
          }
        }
      );

    this.selectedFilterDataSubs =
      this.filterService.selectedFilterData.subscribe((data) => {
        if (data) {
          this.offset = 0;
          this.loadFilter = true;
          this.resultData = [];
          this.isLoading = true;
          this.loadResult(0).then(() => {
            this.isLoading = false;
          });
        }
      });
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.setScreenName({
        screenName: 'Ladder',
        nameOverride: 'ResultsPage',
      })
        .then((res: any) => {})
        .catch((error: any) => console.error(error));
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad........');
  }

  loadResult(loadFavourite) {
    return new Promise<void>((resolve, reject) => {
      // if (this.resultData.length == 0) {
      //   this.isLoading = true;
      // }

      this.deviceService.getDeviceId().then((data) => {
        if (this.loadResultSubscription) {
          this.loadResultSubscription.unsubscribe();
        }

        this.loadResultSubscription = this.resultService
          .getResultData(
            '',
            '',
            data.uuid.toString(),
            data.model.toString(),
            loadFavourite,
            this.offset
          )
          .subscribe(
            (data) => {
              // console.log(data);

              // if (this.resultData.length == 0) {
              //   this.isLoading = false;
              // }

              if (this.offset > 0) {
                this.resultService.previousDate =
                  this.resultData[this.resultData.length - 1].dateHeader;
                this.resultService.previousSport =
                  this.resultData[this.resultData.length - 1].gameGroup[
                    this.resultData[this.resultData.length - 1].gameGroup
                      .length - 1
                  ].sportName;
              }

              if (this.offset == 0) {
                this.resultData = [];
                this.resultService.previousDate = null;
                this.resultService.previousSport = null;
              }
              this.resultData = this.resultData.concat(data.resultList);
              this.recordCount = data.totalRecords;

              this.perPage = data.fetchRecords;
              this.itemsLoaded = data.currentRows;
              resolve();
            },
            (error) => {
              this.isLoading = false;
              console.log(' ---- error -- ', JSON.stringify(error));
              reject(error);
            }
          );
      });
    });
  }

  ngOnDestroy() {}

  ionViewDidLeave() {
    this.competitionSubscription.unsubscribe(); // unsubscribe
    this.loadResultSubscription.unsubscribe(); // unsubscribe
    this.selectedFilterDataSubs.unsubscribe();
    this.reloadAfterAcceptProtest.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
    // this.resultData = [];
    //this.menuCntrl.enable(false);
    this.filterService.clearFilter();
  }

  loadData(event) {
    this.offset++;

    console.log('this.perPage', this.perPage);
    console.log('this.itemsLoaded', this.itemsLoaded);

    if (this.perPage == this.itemsLoaded) {
      this.loadResult(0).then(() => {
        // alert("----Ok")
        event.target.complete();
        if (this.perPage != this.itemsLoaded) {
          event.target.disabled = true;
        }
      });
    } else {
      event.target.disabled = true;
    }
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
