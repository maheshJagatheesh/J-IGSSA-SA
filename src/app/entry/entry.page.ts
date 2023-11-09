import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, MenuController, NavParams, Platform } from '@ionic/angular';
import { TeamsService } from '../teams/teams.service';
import { TeamsPage } from '../teams/teams.page';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
})
export class EntryPage implements OnInit {

  subscription;
  loginSubscription: Subscription;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private nav: NavController,
    private menu: MenuController,
    private teamsService: TeamsService,
    public platform: Platform,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    // console.log("ngOnInit entry----");

  }

  goLandingPage() {
    this.router.navigateByUrl('/landing-page');
    // this.nav.push(TeamsPage, {
    //   item: 1
    // });
  }

  goLoginPage() {
    this.router.navigateByUrl('/login');
  }

  ionViewWillEnter() {
    // console.log("ionViewWillEnter entry----");
    this.menu.enable(false);
    this.loginSubscription = this.loginService.isUserLogedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  goToExplore() {
    this.teamsService.loadExplore.emit(true)
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }


  ionViewDidLeave() {
    // console.log("ionViewDidLeave entry----");
    //this.menu.enable(true);
  }

  goExplore() {
    this.router.navigateByUrl('home/tabs/teams/1');
  }
}
