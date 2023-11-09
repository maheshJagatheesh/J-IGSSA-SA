import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { LaderService } from './lader.service';
import { environment } from '../../environments/environment';
import { DeviceService } from '../shared/device/device.service';
import { CompetitionFilterService } from '../shared/components/competition-filter/competition-filter.service';
import { Subscription } from 'rxjs';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-laders',
  templateUrl: './laders.page.html',
  styleUrls: ['./laders.page.scss'],
})
export class LadersPage implements OnInit {
  isLoading = false;
  ladderGames: [] = [];
  favouriteTeams: any = [];
  imgBaseUrl = environment.logoImgPath;
  competitionSubscription: Subscription;
  constructor(
    private menuCntrl: MenuController,
    private ladderService: LaderService,
    private deviceService: DeviceService,
    private competitionFilterService: CompetitionFilterService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    // if (Capacitor.isNative) {
    //  FirebaseAnalytics.setCollectionEnabled({
    //   enabled: true,
    // });
    //  FirebaseAnalytics.
    // setScreenName({
    //   screenName: 'Ladder',
    //   nameOverride: 'LadersPage',
    // })
    //     .then((res: any) => console.log(res)).catch((error: any) => console.error(error));
    // }

    // this.isLoading = true;
    // console.log('----ION---');
    this.loadLadderGames();
    this.menuCntrl.enable(false);

    this.competitionSubscription =
      this.competitionFilterService.subAssociationFilterSelected.subscribe(
        (data) => {
          if (data) {
            this.loadLadderGames();
          }
        }
      );
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.setScreenName({
        screenName: 'Ladder',
        nameOverride: 'LadersPage',
      })
        .then((res: any) => {})
        .catch((error: any) => console.error(error));
    }
  }

  toggleFilter() {
    this.menuCntrl.toggle();
  }

  loadLadderGames() {
    this.isLoading = true;
    this.deviceService.getDeviceId().then((data) => {
      this.ladderService
        .getLadderGame(data.uuid.toString(), data.model.toString())
        .subscribe((data) => {
          this.isLoading = false;
          this.ladderGames = data.GETGAME;
          this.favouriteTeams = data.FAVOURITETEAM;
          // console.log(data);
        });
    });
  }

  ionViewDidLeave() {
    this.competitionSubscription.unsubscribe(); // unsubscribe
  }
}
