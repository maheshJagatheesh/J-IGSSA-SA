import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Favourite } from 'src/app/Model/Teams/Favourite.model';
import { TeamsService } from '../teams.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss'],
})
export class FavouriteComponent implements OnChanges, OnInit {
  @Input() favouriteTeam: any;
  @Input() isLoggedIn: boolean;
  @Input() showDraw: number;
  isSelected: boolean;
  imgBaseUrl = environment.logoImgPath;
  resultsLabel: Array<any>;

  constructor(
    private teamsServise: TeamsService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnChanges() {
    console.log('favouriteTeam --', this.favouriteTeam);
    this.resultsLabel = this.favouriteTeam.result.reduce((acc, crr) => {
      switch (crr) {
        case 'D':
          acc.push({
            label: crr,
            class: 'icon-d',
          });
          break;
        case 'W':
          acc.push({
            label: crr,
            class: 'icon-w',
          });
          break;
        case 'L':
          acc.push({
            label: crr,
            class: 'icon-l',
          });
          break;
        case 'FW':
          acc.push({
            label: crr,
            class: 'icon-w',
          });
          break;
        default:
          acc.push({
            label: crr,
            class: '',
          });
      }
      return acc;
    }, []);
  }

  ngOnInit() {
    this.isSelected = false;
  }

  selectTeam() {
    this.isSelected = !this.isSelected;
  }
  removeFavouriteTeam(favouriteTeamId) {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCollectionEnabled({
        enabled: true,
      });
      FirebaseAnalytics.logEvent({
        name: 'Remove_favorite',
        params: {
          club_division_id: favouriteTeamId,
        },
      })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }

    this.teamsServise.removeFavouriteTeam(favouriteTeamId).subscribe((data) => {
      if (data) {
        this.showAlert('Success', 'Team removed from favourite');
      }
    });
  }

  showAlert(header: string, message: string) {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

  navigateFixture() {
    this.router.navigateByUrl(
      'home/tabs/fixtures/' + this.favouriteTeam.favouriteTeamId
    );
  }
}
