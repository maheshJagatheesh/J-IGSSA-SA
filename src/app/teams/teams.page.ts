import { Component, OnInit } from '@angular/core';
import { TeamsService } from './teams.service';
import { ClubList } from '../Model/Teams/ClubList';
import {
  MenuController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LoginService } from '../login/login.service';
import { UserService } from '../shared/user/user.service';
import { Favourite } from '../Model/Teams/Favourite.model';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../shared/device/device.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CompetitionFilterComponent } from '../shared/components/competition-filter/competition-filter.component';
import { CompetitionFilterService } from '../shared/components/competition-filter/competition-filter.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared/services/shared.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;

  segment: string;
  loadMyTeam: boolean = true;
  favouriteTeams: Favourite[] = [];
  clubList: ClubList[];
  imgBaseUrl = environment.logoImgPath;
  isLoading = false;
  isLoggedIn = false;
  showDraw: number = 0;

  routeSubscription;
  teamRemovedSubsctription;
  competitionSubscription: Subscription;
  teamServiceObs: Subscription;

  constructor(
    private teamsService: TeamsService,
    private menuCntrl: MenuController,
    private loginService: LoginService,
    private userservise: UserService,
    private sharedServise: SharedService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private router: Router,
    private modalCtrl: ModalController,
    private competitionFilterService: CompetitionFilterService
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    // this.setFilteredItems("");

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe((search) => {
        this.searching = false;
        if (search.length > 0) {
          this.setFilteredItems(search);
        } else {
          this.loadMyExplore();
        }
      });
  }

  ionViewWillEnter() {
    this.loginService.isUserLogedIn.subscribe((isLogedIn) => {
      this.isLoggedIn = isLogedIn;
    });

    this.sharedServise.appsettings.subscribe((settings) => {
      this.showDraw = settings.showDraw;
    });

    this.teamRemovedSubsctription =
      this.teamsService.onFavoutiteRemove.subscribe((data) => {
        if (data) {
          console.log('event --');
          console.log(data);
          // this.segment = 'myTeams';
          this.loadMyTeams('after success');
        }
      });

    this.menuCntrl.enable(false);

    this.loadPageDetails();
    if (this.competitionSubscription) {
      this.competitionSubscription.unsubscribe();
    }
    this.competitionSubscription =
      this.competitionFilterService.subAssociationFilterSelected.subscribe(
        (data) => {
          if (data) {
            this.loadPageDetails();
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
        screenName: 'Teams',
        nameOverride: 'TeamsPage',
      })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }
  }

  loadPageDetails() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap);
      console.log(paramMap.get('segment'));
      if (paramMap.has('segment')) {
        // alert("if");
        // this.loadMyTeam = false;
        // this.segment = 'explore';

        if (paramMap.get('segment') == '1') {
          this.loadMyTeam = false;
          this.segment = 'explore';
          this.loadMyExplore();
        } else {
          this.loadMyTeam = true;
          this.segment = 'myTeams';
          this.loadMyTeams('router');
        }
      } else {
        if (!this.isLoading) {
          console.log('--- load ---');
          this.loadMyTeam = true;
          this.segment = 'myTeams';
          this.loadMyTeams('routerParam');
        }
      }
    });
  }

  addFavouriteTeam() {
    this.loadMyTeam = false;
    this.segment = 'explore';
  }

  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    switch (ev.detail.value) {
      case 'myTeams':
        if (!this.isLoading) {
          this.router.navigateByUrl('home/tabs/teams/0');
          // this.loadMyTeam = true;
          // this.loadMyTeams("segmentChanged");
        }
        break;
      case 'explore':
        this.router.navigateByUrl('home/tabs/teams/1');
        // this.loadMyTeam = false;
        // this.loadMyExplore();
        break;
    }
  }

  loadMyTeams(msg) {
    console.log('from ...' + msg);
    this.isLoading = true;
    this.favouriteTeams = [];
    this.loadingController
      .create({ keyboardClose: true, message: '' })
      .then((loadingEl) => {
        loadingEl.present();

        this.deviceService.getDeviceId().then((data) => {
          if (data) {
            this.teamServiceObs = this.teamsService
              .loadFavouriteTeams(data.uuid.toString(), data.model)
              .subscribe(
                (data) => {
                  console.log(data.length);
                  this.favouriteTeams = data;
                  loadingEl.dismiss();
                  this.isLoading = false;
                },
                (error) => {
                  loadingEl.dismiss();
                  this.isLoading = false;
                  console.log('error loadFavouriteTeams-' + error);
                }
              );
          }
          (error) => {
            loadingEl.dismiss();
            this.isLoading = false;
            console.log('error -' + error);
          };
        });

        // this.userservise.getUser().subscribe(data => {
        //   loadingEl.dismiss();

        //   if (data) {
        //     console.log("Loged in.... Person id " + data.personId);
        //     this.teamsService.loadFavouriteTeams(data.personId.toString()).subscribe(data => {
        //       console.log(data.length);
        //       this.favouriteTeams = data;
        //       this.isLoading = false;
        //     },
        //       error => {
        //         console.log("error loadFavouriteTeams-" + error);
        //       })
        //   } else {
        //     this.favouriteTeams = [];
        //     this.isLoading = false;
        //     console.log("Not loged in...");
        //   }
        // },
        // error => {
        //     this.isLoading = false;
        //     console.log("error -" + error);
        //   })
      });
  }

  loadMyExplore() {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: '' })
      .then((loadingEl) => {
        loadingEl.present();
        this.teamsService.loadClubList().subscribe((data) => {
          this.isLoading = false;
          loadingEl.dismiss();
          console.log('loadClubList...' + data.length);
          this.clubList = data;
        });
      });
  }

  toggleFilter() {
    this.menuCntrl.toggle();
  }

  ionViewWillLeave() {
    this.routeSubscription.unsubscribe();
    this.teamRemovedSubsctription.unsubscribe();
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems(searchTerm) {
    if (!this.searching) {
      this.teamsService.filterTeams(searchTerm).subscribe((data) => {
        this.clubList = data;
      });
    }
  }

  cancelSearch() {
    this.searching = true;
    this.loadMyExplore();
  }

  ionViewDidLeave() {
    this.routeSubscription.unsubscribe();
    this.competitionSubscription.unsubscribe(); // unsubscribe
    this.teamRemovedSubsctription.unsubscribe(); // unsubscribe
  }
}
