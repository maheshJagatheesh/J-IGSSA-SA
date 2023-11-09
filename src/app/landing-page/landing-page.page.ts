import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, LoadingController } from '@ionic/angular';
import { NotificationService } from '../notifications/notification.service';
import { DeviceService } from '../shared/device/device.service';
import { SharedService } from '../shared/services/shared.service';
import { forkJoin, combineLatest, Subscription } from 'rxjs';
import { LoginService } from '../login/login.service';
import { StatusBar, Style } from '@capacitor/status-bar';

// const slideOpts = {
//   initialSlide: 1,
//   speed: 400,

//   cubeEffect: {
//     shadow: true,
//     slideShadows: true,
//     shadowOffset: 20,
//     shadowScale: 0.94,
//   }
// };

class AssoSettings {
  eventName: string;
  message: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit, OnDestroy {
  subscription;
  latestNews = [];

  slideOpts = {
    initialSlide: 1,
    speed: 400,

    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
  };
  isLoggedIn: boolean = false;
  loginSubscription: Subscription;

  constructor(
    private router: Router,
    private menu: MenuController,
    public platform: Platform,
    private notificationService: NotificationService,
    private loadingCntrl: LoadingController,
    private deviceService: DeviceService,
    private sharedService: SharedService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // console.log("OnInit landing page");
    //this.menu.enable(false);
  }

  ngOnDestroy() {
    // console.log("ngOnDestroy landing page");
    //this.menu.enable(true);
  }

  navigate(option) {
    // let option = 2;
    switch (option) {
      case 1:
        this.router.navigateByUrl('/home/tabs/teams/0');
        break;

      case 2:
        this.router.navigateByUrl('/home/tabs/fixtures');
        break;

      case 3:
        this.router.navigateByUrl('/home/tabs/results');
        break;

      case 4:
        this.router.navigateByUrl('/home/tabs/lader');
        break;
    }
  }

  ionViewDidEnter() {
    // console.log("ionViewDidEnter landing page");
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillEnter() {
    this.loadRecentNews();
    // console.log("ionViewWillEnter landing page");
    this.loginSubscription = this.loginService.isUserLogedIn.subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    );

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // console.log("ionViewDidLeave landing page");
    // this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

  goLoginPage() {
    this.router.navigateByUrl('/login');
  }

  loadRecentNews() {
    this.loadingCntrl
      .create({ keyboardClose: true, message: '' })
      .then((loadingEl) => {
        loadingEl.present();

        this.deviceService.getDeviceId().then((data) => {
          this.sharedService.appsettings.subscribe((set) => {
            // console.log("loadRecentNews settings ...", set);
          });

          combineLatest([
            this.notificationService.loadLandingPageNotification(
              data.uuid.toString(),
              data.model.toString()
            ),
            this.sharedService.appsettings,
          ]).subscribe(
            ([notifications, welcomeMsg]) => {
              this.latestNews =
                welcomeMsg.welcomeMessageHeader ||
                welcomeMsg.welcomeMessageContent
                  ? [
                      {
                        eventName: welcomeMsg.welcomeMessageHeader,
                        message: welcomeMsg.welcomeMessageContent,
                      },
                      ...notifications.GETGROUPMESSAGE,
                    ]
                  : [...notifications.GETGROUPMESSAGE];
              // console.log('Result ....', result)
              loadingEl.dismiss();
            },
            (error) => {
              loadingEl.dismiss();
            }
          );
        });
      });
  }
}
