import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/shared/user/user.service';
import { environment } from 'src/environments/environment';
import { LoadingController, AlertController } from '@ionic/angular';
import { TeamsService } from '../teams.service';
import { DeviceService } from 'src/app/shared/device/device.service';
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Component({
  selector: 'app-team-division',
  templateUrl: './team-division.component.html',
  styleUrls: ['./team-division.component.scss'],
})
export class TeamDivisionComponent implements OnInit {
  @Input() teamList;
  @Output() club_division_id = new EventEmitter<number>();
  isFavourite = false;
  userLogedIn = false;
  isChecked = false;
  constructor(
    private userServise: UserService,
    private loadingController: LoadingController,
    private teamServise: TeamsService,
    private alertCtrl: AlertController,
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.userServise.getUser().subscribe((user) => {
      if (user) {
        this.userLogedIn = true;
      }
    });
  }

  addFavourite(club_division_id) {
    // alert(club_division_id);
    this.isChecked = true;
    this.loadingController
      .create({ keyboardClose: true, message: '' })
      .then((loadingEl) => {
        loadingEl.present();

        this.deviceService.getDeviceId().then((data) => {
          if (data) {
            if (Capacitor.isNativePlatform()) {
              FirebaseAnalytics.setCollectionEnabled({
                enabled: true,
              });
              FirebaseAnalytics.logEvent({
                name: 'Add_favorite',
                params: {
                  club_division_id,
                },
              })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }

            this.teamServise
              .setFavouriteTeam(club_division_id, data.uuid, data.model)
              .subscribe((data) => {
                loadingEl.dismiss();
                if (data) {
                  this.showAlert(
                    'Added!',
                    'Find it in My Teams and use it in your filters'
                  );
                  // console.log("fav---", this.teamList)
                  this.teamList = { ...this.teamList, isFavorite: 1 };
                  // console.log("fav---", this.teamList);
                  this.club_division_id.emit(this.teamList.club_division_id);
                } else {
                  this.showAlert('Error', 'something went wrong !');
                }
                console.log(data);
              });
          }
        });
      });

    this.isFavourite = !this.isFavourite;
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
}
