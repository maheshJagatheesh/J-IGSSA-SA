import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { User } from 'src/app/Model/User/User.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../user/user.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-common-scoring',
  templateUrl: './common-scoring.component.html',
  styleUrls: ['./common-scoring.component.scss'],
})
export class CommonScoringComponent implements OnInit {

  loginServiceUser: any;
  currentUser: Subscription;
  isLoggedIn = false;
  showActiveIcon = false;
  isScoringTabAvailable: number = 0;
  isScoringTabEnabled: boolean = false;
  activeTab:string = "";
  constructor(private router: Router, private loginService: LoginService, private userService: UserService, private sharedService: SharedService) { }

  ngOnInit() {
    console.log("on init score=======>")
    this.sharedService.appsettings.subscribe(

      data => {
        console.log("settings...", data)
        this.isScoringTabAvailable = data.showScoringTab
      }
    )

    // this.showActiveIcon = false;
    this.loginServiceUser = this.loginService.isUserLogedIn.subscribe(
      isLogedIn => {
        this.isLoggedIn = isLogedIn;
    });

    console.log(this.router.url.split('/')[3]);
    const urlSeget = this.router.url.split('/')[3];
    if (urlSeget === 'scoring') {
      this.showActiveIcon = true;
      this.isScoringTabEnabled = true;
    }

  }


  showScoring() {
    this.activeTab = this.sharedService.lastActiveTab;
    if(this.isScoringTabEnabled){
      if(this.activeTab) {
        if(this.activeTab == 'teams'){
          this.router.navigateByUrl(`/home/tabs/${this.activeTab}/0`);
        }else {
          this.router.navigateByUrl(`/home/tabs/${this.activeTab}`);
        }
      } else {
        this.router.navigateByUrl(`/home/tabs/fixtures`);
      }
    }
    else {
      this.router.navigateByUrl('home/tabs/scoring');
      // console.log('current user', this.currentUser);
      // console.log('isLoggedIn', this.isLoggedIn);
    }
    // if (this.currentUser == null) {

    //   alert('Current user is null');
    // } else {

    //   alert('Current user is not null');
    // }
  }
}
