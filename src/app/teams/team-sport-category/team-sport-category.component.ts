import { Component, OnInit, Input } from '@angular/core';
import { TeamByClub } from 'src/app/Model/Teams/TeamByClubModel';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-team-sport-category',
  templateUrl: './team-sport-category.component.html',
  styleUrls: ['./team-sport-category.component.scss'],
})
export class TeamSportCategoryComponent implements OnInit {

  @Input() divisionData: TeamByClub;
  showMore: boolean = false;
  imgBaseUrl = environment.logoImgPath;
  constructor() { }

  ngOnInit() {
    console.log(this.divisionData);
  }

  showDetails() {
    this.showMore = !this.showMore;
  }

  ionViewWillEnter() {
    console.log("---- data ----");
    console.log(this.divisionData);
  }

  onFavoutite(id){
  //  alert(id);
    this.divisionData.teamList.filter( el => {
      if( el.club_division_id === id){
        el.isFavorite = 1;
      }
    })
  }

}
