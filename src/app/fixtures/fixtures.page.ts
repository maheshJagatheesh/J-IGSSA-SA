import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FixtureModel } from '../Model/Fixture.model';
import { DrawModel } from '../Model/Draw.model';

import {
  MenuController,
  LoadingController,
  IonInfiniteScroll,
} from '@ionic/angular';
import { FixtureService } from './fixture.service';
import { SharedUiService } from '../shared/shared-ui.service';
import { UserService } from '../shared/user/user.service';
import { FilterService } from '../shared/Filter/filter.service';
import { environment } from 'src/environments/environment';
import { DeviceService } from '../shared/device/device.service';
import { resolve } from 'dns';
import { Subscription, forkJoin } from 'rxjs';
import { CompetitionFilterService } from '../shared/components/competition-filter/competition-filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login/login.service';
import { SharedService } from '../shared/services/shared.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.page.html',
  styleUrls: ['./fixtures.page.scss'],
})
export class FixturesPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  fixtureModel: FixtureModel[] = [];
  drawModel: DrawModel[] = [];
  isLoading = false;
  isLogedIn = false;
  imgBaseUrl = environment.logoImgPath;
  perPage: number;
  recordCount: number;
  offset: number;
  itemsLoaded: number;
  loadFilter: boolean;
  subscription: Subscription;
  subscriptionScoreModal: Subscription;
  competitionSubscription: Subscription;
  filterSubs: Subscription;
  selectedFilterDataSubs: Subscription;
  settingsSub: Subscription;
  showDraw: number = 0;
  routeSubscription: Subscription;
  loginSubscription: Subscription;

  constructor(
    private menuCntrl: MenuController,
    private fixtureService: FixtureService,
    public loadingController: LoadingController,
    private sharedService: SharedUiService,
    private sharedServise: SharedService,
    private userServise: UserService,
    private loginService: LoginService,
    private filterService: FilterService,
    private deviceService: DeviceService,
    private competitionFilterService: CompetitionFilterService,
    private routes: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filterService.setPage(1);

    // this.filterSubs = this.filterService.filterChanged.subscribe(data => {
    //   if (data && data.page == 1) {
    //     this.offset = 0;
    //     this.fixtureModel = [];
    //     this.getFixtureList(0);
    //   }
    // })
  }

  ionViewWillEnter() {
    this.fixtureModel = [];
    this.drawModel = [];
    this.offset = 0;
    this.menuCntrl.enable(true);

    this.settingsSub = this.sharedServise.appsettings.subscribe((settings) => {
      this.showDraw = settings.showDraw;

      // this.isLoading = false;
      this.loginSubscription = this.loginService.isUserLogedIn.subscribe(
        (isLogedIn) => {
          // console.log("login data=====>", isLogedIn)
          this.isLogedIn = isLogedIn;

          this.sharedService.setCurrentPage('2');

          this.routeSubscription = this.routes.params.subscribe((data) => {
            if (data && data.teamId) {
              this.filterService.setSelectedFavourites(data.teamId);
            } else {
              this.getFixtureList(0);
            }
          });

          if (this.subscriptionScoreModal) {
            this.subscriptionScoreModal.unsubscribe();
          }

          this.subscriptionScoreModal =
            this.fixtureService.loadFixtureData.subscribe((data) => {
              if (data) {
                this.offset = 0;
                this.fixtureModel = [];
                this.drawModel = [];
                if (!this.isLogedIn && this.showDraw) {
                  this.getDrawList(0);
                  this.fixtureService.setIsDrawTabEnabled(true);
                } else {
                  this.getFixtureList(0);
                }
              }
            });

          if (this.competitionSubscription) {
            this.competitionSubscription.unsubscribe();
          }

          this.competitionSubscription =
            this.competitionFilterService.subAssociationFilterSelected.subscribe(
              (data) => {
                if (data) {
                  this.filterService.clearFilter();
                  this.offset = 0;
                  this.fixtureModel = [];
                  this.drawModel = [];
                  if (!this.isLogedIn && this.showDraw) {
                    this.getDrawList(0);
                    this.fixtureService.setIsDrawTabEnabled(true);
                  } else {
                    this.getFixtureList(0);
                  }
                }
              }
            );

          // if (this.filterSubs) {
          //   this.filterSubs.unsubscribe();
          // }

          // this.filterSubs = this.filterService.filterChanged.subscribe(data => {
          //   if (data && data.page == 1) {
          //     this.offset = 0;
          //     this.fixtureModel = [];
          //     this.getFixtureList(0);
          //   }
          // })

          if (this.selectedFilterDataSubs) {
            this.selectedFilterDataSubs.unsubscribe();
          }
          this.selectedFilterDataSubs =
            this.filterService.selectedFilterData.subscribe((data) => {
              if (data) {
                this.offset = 0;
                this.fixtureModel = [];
                this.drawModel = [];
                if (!this.isLogedIn && this.showDraw) {
                  this.getDrawList(0);
                  this.fixtureService.setIsDrawTabEnabled(true);
                } else {
                  this.getFixtureList(0);
                }
                // this.getFixtureList(0);
              }
            });
        }
      );
    });
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.setScreenName({
        screenName: 'Fixtures',
        nameOverride: 'FixturesPage',
      })
        .then((res: any) => {})
        .catch((error: any) => console.error(error));
    }
  }

  /*Toggle filter menu */
  toggleFilter() {
    this.menuCntrl.toggle();
  }

  /*Load Fixture details */
  getDrawList(loadFavourite: number) {
    return new Promise<void>((resolve, reject) => {
      if (this.drawModel.length == 0) {
        this.isLoading = true;
      }
      this.deviceService.getDeviceId().then((data) => {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }

        this.subscription = this.fixtureService
          .getDrawList(
            data.uuid.toString(),
            data.model.toString(),
            loadFavourite,
            this.offset
          )
          .subscribe(
            (result) => {
              let data = result;
              this.isLoading = false;

              // if (this.offset == 0) {
              //   this.drawModel = [];
              // }

              if (this.offset > 0) {
                let lastDrawDetails = this.drawModel[this.drawModel.length - 1];
                let previousRoundDate =
                  lastDrawDetails.Draw_data[0].date_schedule;
                if (
                  this.offset > 0 &&
                  lastDrawDetails.round == data.drawList[0].round &&
                  previousRoundDate ==
                    data.drawList[0].Draw_data[0].date_schedule
                ) {
                  this.fixtureService.previousDateSchedule = previousRoundDate;
                } else {
                  this.fixtureService.previousDateSchedule = null;
                }
              }
              if (this.offset == 0) {
                this.drawModel = [];
                this.fixtureService.previousDateSchedule = null;
              }

              this.drawModel = this.drawModel.concat(data.drawList);
              this.recordCount = data.totalRecords;
              this.perPage = data.fetchRecords;
              this.itemsLoaded = data.currentRows;
              resolve();
            },
            (error) => {
              console.log('Fixture error :: ' + error);
              reject();
            }
          );
      });
    });
  }

  /*Load Fixture details */
  getFixtureList(loadFavourite: number) {
    return new Promise<void>((resolve, reject) => {
      if (this.fixtureModel.length == 0) {
        this.isLoading = true;
      }
      this.deviceService.getDeviceId().then((data) => {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }

        // this.subscription = forkJoin([
        //   this.fixtureService.getFixtureList(data.uuid.toString(), data.model.toString(), loadFavourite, this.offset)
        // ])

        this.subscription = this.fixtureService
          .getFixtureList(
            data.uuid.toString(),
            data.model.toString(),
            loadFavourite,
            this.offset
          )
          .subscribe(
            (result) => {
              let data = result;
              if (this.fixtureModel.length == 0) {
                this.isLoading = false;
              }

              if (this.offset > 0) {
                this.fixtureService.previousDateSchedule =
                  this.fixtureModel[this.fixtureModel.length - 1].date_schedule;
              }
              if (this.offset == 0) {
                this.fixtureModel = [];
                this.fixtureService.previousDateSchedule = null;
              }
              this.fixtureModel = this.fixtureModel.concat(data.fixtureList);
              this.recordCount = data.totalRecords;
              this.perPage = data.fetchRecords;
              this.itemsLoaded = data.currentRows;
              resolve();
            },
            (error) => {
              console.log('Fixture error :: ' + error);
              reject();
            }
          );

        // this.subscription = this.fixtureService.getFixtureList(data.uuid.toString(), data.model.toString(), loadFavourite, this.offset).subscribe(data => {

        //   if (this.fixtureModel.length == 0) {
        //     this.isLoading = false;
        //   }

        //   if (this.offset > 0) {
        //     this.fixtureService.previousDateSchedule = this.fixtureModel[this.fixtureModel.length - 1].date_schedule;
        //   }
        //   if (this.offset == 0) {
        //     this.fixtureModel = [];
        //   }
        //   this.fixtureModel = this.fixtureModel.concat(data.fixtureList);
        //   this.recordCount = data.totalRecords;
        //   this.perPage = data.fetchRecords;
        //   this.itemsLoaded = data.currentRows;
        //   resolve();
        // },
        //   error => {
        //     console.log("Fixture error :: " + error);
        //     reject();
        //   });
      });
    });
  }

  /*Pagination logic */
  loadData(event) {
    this.offset++;
    if (this.perPage == this.itemsLoaded) {
      this.getFixtureList(0).then(() => {
        event.target.complete();
        if (this.perPage != this.itemsLoaded) {
          event.target.disabled = true;
        }
      });
    } else {
      event.target.disabled = true;
    }
  }

  loadDrawData(event) {
    this.offset++;
    if (this.perPage == this.itemsLoaded) {
      this.getDrawList(0).then(() => {
        event.target.complete();
        if (this.perPage != this.itemsLoaded) {
          event.target.disabled = true;
        }
      });
    } else {
      event.target.disabled = true;
    }
  }

  /*Infinate scroll toggle*/
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  ngOnDestroy() {}

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // unsubscribe
    }
    if (this.filterSubs) {
      this.filterSubs.unsubscribe();
    }
    if (this.selectedFilterDataSubs) {
      this.selectedFilterDataSubs.unsubscribe();
    }
    if (this.subscriptionScoreModal) {
      this.subscriptionScoreModal.unsubscribe();
    }
    if (this.competitionSubscription) {
      this.competitionSubscription.unsubscribe(); // unsubscribe
    }
    this.fixtureService.previousDateSchedule = null;
    if (this.filterService) {
      this.filterService.clearFilter(); // clear filter data
    }
    if (this.settingsSub) {
      this.settingsSub.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.fixtureService.setIsDrawTabEnabled(false);
  }
}
