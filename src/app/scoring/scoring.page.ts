import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../shared/device/device.service';
import { ScoringService } from './scoring.service';
import { MenuController } from '@ionic/angular';
import { FilterService } from '../shared/Filter/filter.service';
import { Subscription } from 'rxjs';
import { FixtureService } from '../fixtures/fixture.service';
import { CompetitionFilterService } from '../shared/components/competition-filter/competition-filter.service';
import { ResultsService } from '../results/results.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.page.html',
  styleUrls: ['./scoring.page.scss'],
})
export class ScoringPage implements OnInit {
  fixtureModel = [];
  isLoading = false;
  subscriptionScoreModal: Subscription;
  subscription: Subscription;
  filterSubscription: Subscription;
  competitionSubscription: Subscription;
  selectedFilterDataSubs: Subscription;
  isPageActive: boolean;
  reloadAfterAcceptProtest: Subscription;

  constructor(
    private deviceService: DeviceService,
    private scoringService: ScoringService,
    private menuCntrl: MenuController,
    private filterService: FilterService,
    private fixtureService: FixtureService,
    private resultService: ResultsService,
    private competitionFilterService: CompetitionFilterService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isPageActive = true;
    this.menuCntrl.enable(true);
    this.filterService.setPage(1);
    this.getScoringListTierBased(0);

    // this.filterSubscription = this.filterService.filterChanged.subscribe(data => {
    //   if (data && data.page == 1) {
    //     // this.offset = 0;
    //     this.fixtureModel = [];
    //     this.getScoringListTierBased(0);
    //   }
    // });

    this.subscriptionScoreModal = this.fixtureService.loadFixtureData.subscribe(
      (data) => {
        if (data && this.isPageActive) {
          this.getScoringListTierBased(0);
        }
      }
    );

    this.selectedFilterDataSubs =
      this.filterService.selectedFilterData.subscribe((data) => {
        if (data && this.isPageActive) {
          this.getScoringListTierBased(0);
        }
      });

    this.competitionSubscription =
      this.competitionFilterService.subAssociationFilterSelected.subscribe(
        (data) => {
          if (data && this.isPageActive) {
            this.filterService.clearFilter();
            this.getScoringListTierBased(0);
          }
        }
      );

    this.reloadAfterAcceptProtest = this.resultService.loadResult.subscribe(
      (data) => {
        if (data && this.isPageActive) {
          this.getScoringListTierBased(0);
        }
      }
    );
  }

  getScoringListTierBased(loadFavourite) {
    this.isLoading = true;
    this.deviceService.getDeviceId().then((data) => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.scoringService
        .getScoringListTierBased(
          data.uuid.toString(),
          data.model.toString(),
          loadFavourite
        )
        .subscribe(
          (data) => {
            this.fixtureModel = data.GETSCORINGLIST;
            console.log('data--- Scoring');
            console.log(data);
            this.isLoading = false;
          },
          (error) => {
            console.log('error :: ' + error);
          }
        );
    });
  }

  toggleFilter() {
    this.menuCntrl.toggle();
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.setScreenName({
        screenName: 'Whistle',
        nameOverride: 'ScoringPage',
      })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }
  }

  ionViewDidLeave() {
    this.isPageActive = false;
    // this.filterSubscription.unsubscribe();
    this.selectedFilterDataSubs.unsubscribe();
    this.subscriptionScoreModal.unsubscribe(); // unsubscribe
    this.subscription.unsubscribe();
    this.reloadAfterAcceptProtest.unsubscribe();
    this.competitionSubscription.unsubscribe();
    this.filterService.clearFilter(); // clear filter data

    console.log('Clear all subs and filter from scoring');
  }
}
