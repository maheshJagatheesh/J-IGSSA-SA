import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedUiService } from '../shared/shared-ui.service';
import { LoginService } from '../login/login.service';
import { UserService } from '../shared/user/user.service';
import { SharedService } from '../shared/services/shared.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  activated = 1;
  isLogedIn = false;
  showDraw: number = 0;
  showMoreTab: boolean = false;

  loginSub: Subscription;
  sharedServiceSub: Subscription;
  routeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedUiService,
    private sharedServise: SharedService,
    private loginService: LoginService,
    private userServise: UserService
  ) {}

  ionViewDidLoad() {
    // console.log("ionViewDidLoad()...");
  }

  ionViewWillEnter() {
    this.showMoreTab = environment.showMoreTab;
    this.loginService.userLoggedIn.subscribe((result) => {
      // console.log(" usr ---" + result);
    });

    this.sharedServiceSub = this.sharedServise.appsettings.subscribe(
      (settings) => {
        this.showDraw = settings.showDraw;
      }
    );

    this.loginSub = this.loginService.isUserLogedIn.subscribe((isLogedIn) => {
      this.isLogedIn = isLogedIn;
    });

    this.routeSub = this.route.url.subscribe((url) => {
      // console.log("url", url);
      // if (this.router.url.split('/')[3] === 'scoring') {
      //   this.activated = 6;
      // } else if (this.router.url.split('/')[3] === 'notification') {
      //   this.activated = 5;
      // } else if (this.router.url.split('/')[3] === 'fixtures') {
      //   this.activated = 2;
      // }
      // console.log("seg", this.router.url.split('/')[3]);
      let urlSeget = this.router.url.split('/');
      if (urlSeget.length >= 3) {
        switch (urlSeget[3]) {
          case 'teams':
            this.activated = 1;
            this.sharedServise.setLastActiveTab(urlSeget[3]);
            break;
          case 'fixtures':
            this.activated = 2;
            this.sharedServise.setLastActiveTab(urlSeget[3]);
            break;
          case 'results':
            this.activated = 3;
            this.sharedServise.setLastActiveTab(urlSeget[3]);
            break;
          case 'lader':
            this.activated = 4;
            this.sharedServise.setLastActiveTab(urlSeget[3]);
            break;
          case 'notification':
            this.activated = 5;
            this.sharedServise.setLastActiveTab(urlSeget[3]);
            break;
          case 'scoring':
            this.activated = 6;
            break;
          case 'more':
            this.activated = 7;
            break;
          default:
            this.activated = 0;
        }
      }
    });
  }

  ionViewDidEnter() {
    // console.log("home.page.ts ionViewDidEnter()...")
  }

  activateTab(no) {
    this.activated = no;
     //console.log("activated",this.activated)
    //console.log("router",this.router);

    switch (no) {
      case 1:
        this.router.navigateByUrl('home/tabs/teams/0');
        break;
      case 2:
        this.router.navigateByUrl('home/tabs/fixtures');
        break;
      case 3:
        this.router.navigateByUrl('home/tabs/results');
        break;
      case 4:
        this.router.navigateByUrl('home/tabs/lader');
        break;
      case 5:
        this.router.navigateByUrl('home/tabs/notification');
        break;
      case 6:
        this.router.navigateByUrl('home/tabs/scoring');
        break;
      case 7:
        this.router.navigateByUrl('home/tabs/more');
        break;
    }
  }

  ionViewWillLeave() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.sharedServiceSub) {
      this.sharedServiceSub.unsubscribe();
    }
  }
}
