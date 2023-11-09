import { Component, OnInit } from '@angular/core';

import { Platform, MenuController, AlertController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './login/login.service';

// import { Plugins } from '@capacitor/core'
import { Router } from '@angular/router';
import { FixtureService } from './fixtures/fixture.service';
import {
  FilterModel,
  DivivsionList,
  SchoolList,
  RoundList,
  SportList,
  FavouriteTeamList,
} from './Model/Filter/Filter.model';
import { FilterService } from './shared/Filter/filter.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { Capacitor } from '@capacitor/core';

import { PushNotifications } from '@capacitor/push-notifications';

import { DeviceService } from './shared/device/device.service';
import { TeamsService } from './teams/teams.service';
import { PushNotificationService } from './shared/push-notification.service';
import {
  CompetitionFilterService,
  competitionFilterConst,
} from './shared/components/competition-filter/competition-filter.service';
import { Subscription, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { httpOptions } from './shared/api/api-call';
import { map, switchMap, take } from 'rxjs/operators';
import { SharedService } from './shared/services/shared.service';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import { UserService } from './shared/user/user.service';
import { Browser } from '@capacitor/browser';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {
  filterType;
  isLogedIn: any;
  filter: FilterModel;
  filterLoaded = false;
  heading = '';
  currentPage = 0;

  favouriteTeamList: FavouriteTeamList[] = [];
  divisionList: DivivsionList[] = [];
  schoolList: SchoolList[];
  roundList: RoundList[];
  sportList: SportList[];
  fcmToken: string;
  deviceIDList: any;
  associationSettingsList: any;

  loadFilterSubs: Subscription;
  userSubscription: Subscription;
  isDrawTabEnabled: boolean = false;
  userSub: Subscription;

  currentUser: any = null;
  showInjuryIcon: boolean = false;
  injuryUrl: string = '';
  clubId: number = null;
  encPassword: string = 'xp2eExs4PqdA53L=';

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCntrl: MenuController,
    private loginService: LoginService,
    private fixtureService: FixtureService,
    private router: Router,
    public filterService: FilterService,
    private screenOrientation: ScreenOrientation,
    private deviceService: DeviceService,
    private teamsService: TeamsService,
    private pushNotificationService: PushNotificationService,
    private competitionFilterService: CompetitionFilterService,
    private alertController: AlertController,
    private http: HttpClient,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    this.initializeApp();
    this.filterType = 0;
    this.loginService.userLoggedIn.subscribe((result) => {
      this.isLogedIn = result;
    });
  }

  async initializeApp() {
    if (Capacitor.isNativePlatform()) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      Capacitor.isNativePlatform()
        ? this.statusBar.overlaysWebView(false)
        : null;
      Capacitor.isNativePlatform()
        ? this.statusBar.backgroundColorByName('black')
        : null;
      if (Capacitor.isNativePlatform()) {
        setTimeout(()=>{
                      SplashScreen.hide({
                        fadeOutDuration: 1000
                      });
                    }, 2000)
      }

      forkJoin([
        this.deviceService.getDeviceId(),
        this.sharedService.getAssociationSettings(),
      ]).subscribe((combinedResult) => {
        // console.log('Both API calls finished...', combinedResult);
        this.deviceIDList = combinedResult[0];
        this.associationSettingsList = combinedResult[1];

        if (this.deviceIDList) {
          this.teamsService
            .loadFavouriteTeams(
              combinedResult[0].uuid.toString(),
              combinedResult[0].model
            )
            .subscribe(
              (data) => {
                if (data.length > 0) {
                  if (Capacitor.isNativePlatform()) {
                    FirebaseAnalytics.enable();
                    FirebaseAnalytics.setUserProperty({
                      name: 'Favorites',
                      value: data.length.toString(),
                    })
                      .then((res: any) => {})
                      .catch((error: any) => console.error(error));
                  }
                  if (Capacitor.isNativePlatform()) {
                    setTimeout(()=>{
                      SplashScreen.hide({
                        fadeOutDuration: 1000
                      });
                    }, 2000)
                  }
                  // this.router.navigateByUrl('/landing-page');
                } else {
                  if (Capacitor.isNativePlatform()) {
                    setTimeout(()=>{
                      SplashScreen.hide({
                        fadeOutDuration: 1000
                      });
                    }, 2000)
                  }
                }
              },
              (error) => {
                console.log('Error in fetching device details', error);
              }
            );
        }
      });

      this.deviceService.getDeviceId().then((data) => {
        if (data) {
          this.teamsService
            .loadFavouriteTeams(data.uuid.toString(), data.model)
            .subscribe(
              (data) => {
                if (data.length > 0) {
                  Capacitor.isNativePlatform()
                    ? setTimeout(()=>{
                      SplashScreen.hide({
                        fadeOutDuration: 1000
                      });
                    }, 2000)
                    : null;
                  this.router.navigateByUrl('/landing-page');
                } else {
                  Capacitor.isNativePlatform()
                    ? setTimeout(()=>{
                      SplashScreen.hide({
                        fadeOutDuration: 1000
                      });
                    }, 2000)
                    : null;
                }
              },
              (error) => {}
            );
        }
      });

      this.loginService.isUserLogedIn.subscribe((data) => {
        if (data) {
          // this.router.navigateByUrl('/landing-page');
          /* --- get favourite team by person-id */
        } else {
          // this.router.navigateByUrl('/entry');
          /* -- get favourite team by device-id */
        }
      });
    });
    const data = await this.deviceService.getDeviceId();
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.enable();

      FirebaseAnalytics.setUserProperty({ name: 'Device_id', value: data.uuid })
        .then((res: any) => {})
        .catch((error: any) => console.error(error));

      FirebaseAnalytics.setUserProperty({
        name: 'Device_model',
        value: data.model,
      })
        .then((res: any) => {})
        .catch((error: any) => console.error(error));

      FirebaseAnalytics.setUserProperty({
        name: 'Association',
        value: environment.appName,
      })
        .then((res: any) => {})
        .catch((error: any) => console.error(error));
    }
  }

  ngOnInit() {
    // this.filterService.testSub.subscribe(data => {
    // })

    this.fixtureService.DrawTabEnabled.subscribe((data) => {
      this.isDrawTabEnabled = data;
    });

    this.filterService.filterData.subscribe((data) => {
      // console.log('load filter....');
      this.favouriteTeamList = [...data.favouriteTeamList];
      this.divisionList = [...data.divivsionList];
      this.schoolList = [...data.schoolList];
      this.roundList = [...data.roundList];
      this.sportList = [...data.sportList];
      this.filterLoaded = true;
    });

    this.competitionFilterService
      .loadCompetitionFilter()
      .subscribe((result) => {});
    this.loginService.autoLogin().subscribe((res) => {
      this.isLogedIn = res;
      if (Capacitor.isNativePlatform()) {
        if (res) {
          this.userSubscription = this.loginService.user.subscribe((user) => {
            FirebaseAnalytics.enable();
            FirebaseAnalytics.setUserProperty({
              name: 'Logged_in',
              value: user.clientId.toString(),
            })
              .then((res: any) => {})
              .catch((error: any) => console.error(error));
          });
        } else {
          FirebaseAnalytics.enable();
          FirebaseAnalytics.setUserProperty({ name: 'Logged_in', value: '0' })
            .then((res: any) => {})
            .catch((error: any) => console.error(error));
        }
      }
    });

    this.competitionFilterService
      .getFilterData(competitionFilterConst.SELECTED_ASSOCIATION_ID)
      .subscribe((data) => {
        if (data) {
          // console.log('data SELECTED_ASSOCIATION_ID', data);
          this.filterService.selectedAssociationId = data;
        }
      });

    this.sharedService.appsettings.subscribe((data) => {
      (this.injuryUrl = data.injuryUrl), (this.clubId = data.club_id);
    });

    this.loginService.isUserLogedIn.subscribe((isLogedIn) => {
      this.isLogedIn = isLogedIn;
    });

    this.userSub = this.loginService.user.subscribe((_res) => {
      if (_res) {
        this.currentUser = _res;
        if (_res.adminLevel == 1 || _res.adminLevel == 2) {
          this.showInjuryIcon = true;
        } else {
          this.showInjuryIcon = false;
        }
      } else {
        this.showInjuryIcon = false;
        this.currentUser = null;
      }
    });

    if (this.loadFilterSubs) {
      this.loadFilterSubs.unsubscribe();
    }
    /* --- Firebase Push Notificatiion --- */

    // console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    if (Capacitor.isPluginAvailable('PushNotifications')) {
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      // PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        // console.log('FCM Token', token.value);
        const data = await this.deviceService.getDeviceId();
        // if (this.platform.is('ios')) {
        //   this.fcmToken = (await fcm.getToken()).token;
        // } else {
        // }
        this.fcmToken = token.value;
        await Storage.set({
          key: 'FCMToken',
          value: this.fcmToken,
        });
        this.pushNotificationService
          .setDeviceToken(data.uuid, data.model, this.fcmToken)
          .subscribe((data) => {
            // console.log("Device toke", this.fcmToken);
          });
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
          // alert(notification)
          // console.log('Notification data', notification);
          //  alert('pushNotificationReceived: ' + JSON.stringify(notification));
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          console.log('notificationReceived', notification);
          this.router.navigateByUrl('home/tabs/notification');
          // alert('pushNotificationActionPerformed: ' + JSON.stringify(notification));
        }
      );
    }

    /* --- Firebase Push Notificatiion ends --- */
  }

  // generateFcmToken(token: string) {
  //   return new Promise((res, rej) => {
  //     let generatedToken: string;
  //     if (this.platform.is('ios')) {
  //       fcm
  //         .getToken()
  //         .then(r => {
  //           generatedToken = r.token;
  //           console.log('iOS FCM Token', r.token);
  //           res(generatedToken);

  //         })
  //         .catch(err => console.log(err));
  //     } else {
  //       generatedToken = token;
  //       res(generatedToken);
  //     }
  //   })
  // }

  onLogOut() {
    this.menuCntrl.close();
    this.loginService.logout();
    this.router.navigateByUrl('/landing-page');
  }

  goLogin() {
    this.menuCntrl.close();
    this.router.navigateByUrl('/login');
  }

  showFilter(option) {
    this.filterType = option;

    switch (option) {
      case 1:
        this.heading = 'My Teams';
        break;
      case 2:
        this.heading = 'Sport';
        break;
      case 3:
        this.heading = 'Division';
        break;
      case 4:
        this.heading = 'School';
        break;
      case 5:
        this.heading = 'Round';
        break;
    }
  }

  async showAboutAlert() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: 'Version No : ' + environment.appVersion,
      buttons: ['Dismiss'],
    });

    await alert.present();
  }

  async redirectInjury() {
    let data = {
      username: this.currentUser.username,
      password: this.currentUser.password,
      clubId: this.clubId,
    };

    let encryptedParam = await this.convertText(data);
    await Browser.open({ url: `${this.injuryUrl}?${encryptedParam}` });
  }

  convertText(param) {
    return new Promise(async (res, rej) => {
      let data = AES.encrypt(
        JSON.stringify(param),
        this.encPassword.trim()
      ).toString();
      // let dec = AES.decrypt(data, this.encPassword.trim()).toString(Utf8);
      res(data);
    });
  }

  toggleFilter() {
    this.menuCntrl.toggle();
    this.filterType = 0;
  }

  backToFilter() {
    this.filterType = 0;
  }

  selectDivision(div) {
    console.log(div + '-------');
  }

  toggleFav(event, id) {}

  ionViewWillEnter() {
    this.heading = '';
    console.log('inside home enter===');
  }
  ionViewDidEnter() {}
  ionViewWillLeave() {}
  ionViewDidLeave() {}

  // getAssociationSettings(){
  //   this.sharedService.getAssociationSettings().subscribe()

  // }
}
