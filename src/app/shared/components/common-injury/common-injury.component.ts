import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { User } from 'src/app/Model/User/User.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../user/user.service';
import { SharedService } from '../../services/shared.service';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-common-injury',
  templateUrl: './common-injury.component.html',
  styleUrls: ['./common-injury.component.scss'],
})
export class CommonInjuryComponent implements OnInit {
  currentUser: any = null;
  isLoggedIn = false;
  showInjuryIcon: boolean = false;
  injuryUrl: string = '';
  clubId: number = null;
  encPassword: string = 'xp2eExs4PqdA53L=';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.appsettings.subscribe((data) => {
      (this.injuryUrl = data.injuryUrl), (this.clubId = data.club_id);
    });

    // this.showActiveIcon = false;
    this.loginService.isUserLogedIn.subscribe((isLogedIn) => {
      this.isLoggedIn = isLogedIn;
    });

    this.loginService.user.subscribe((_res) => {
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
  }

  async redirectInjury() {
    let data = {
      username: this.currentUser.username,
      password: this.currentUser.password,
      clubId: this.clubId,
    };

    let encryptedParam = await this.convertText(data);
    // console.log("encryptedParam===", encryptedParam)
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
}
