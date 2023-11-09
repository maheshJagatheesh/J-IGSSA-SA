import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../teams.service';
import { TeamByClub } from 'src/app/Model/Teams/TeamByClubModel';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/shared/device/device.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-each-team-detail',
  templateUrl: './each-team-detail.page.html',
  styleUrls: ['./each-team-detail.page.scss'],
})
export class EachTeamDetailPage implements OnInit {
  teamByClub: TeamByClub[];
  logoPath: string = environment.logoImgPath;
  isLoading = false;
  constructor(
    private teamService: TeamsService,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private menuCntrl: MenuController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      if (!paramMap.has('clubId')) {
        return;
      }
      this.loadTeamByClub(paramMap.get('clubId'));
    })
  }

  ionViewWillEnter() {
    this.menuCntrl.enable(false);
  }

  loadTeamByClub(clubId) {
    this.isLoading = true;
    this.deviceService.getDeviceId().then(data => {

      this.teamService.loadTeamByClub(clubId, data.uuid.toString(), data.model.toString()).subscribe(data => {
        this.isLoading = false;
        this.logoPath = environment.logoImgPath + data.CLUBLOGO;
        this.teamByClub = data.GETTEAMBYCLUB;
        // console.log(this.teamByClub);
      });
    })

  }

  goTeams() {
    this.router.navigateByUrl('home/tabs/teams/1');


  }

}
