import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FixtureService } from '../fixture.service';

@Component({
  selector: 'app-match-round',
  templateUrl: './match-round.component.html',
  styleUrls: ['./match-round.component.scss'],
})
export class MatchRoundComponent implements OnInit, OnChanges {

  @Input() drawData;
  @Input() isLogedIn;
  showDate: boolean;
  constructor(
    private fixtureService: FixtureService
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    // console.log("DATE ", this.fixtureService.previousDateSchedule)
    // console.log("DATE ", this.drawData.Draw_data[0].date_schedule)
    this.showDate = true;
    if (this.fixtureService.previousDateSchedule && this.drawData && this.drawData.Draw_data[0].date_schedule == this.fixtureService.previousDateSchedule) {
      this.showDate = false;
    }
  }

}
