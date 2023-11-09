import { Component, OnInit, Input } from '@angular/core';
import { FilterService } from 'src/app/shared/Filter/filter.service';
import { FixtureService } from 'src/app/fixtures/fixture.service';

@Component({
  selector: 'app-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
})
export class ToggleOptionComponent implements OnInit {
  @Input() team;
  @Input() currentPage;
  radioBtn = false;
  constructor(
    private filterService: FilterService,
    private fixtureService: FixtureService
  ) { }

  ngOnInit() {
    // console.log("On init Fav ---" + this.filterService.selectedFavourites);
    if (this.filterService.selectedFavourites.includes(this.team.favouriteTeamId)) {
      this.radioBtn = true;
    }
  }

  onTeamChange(id) {
    if (this.radioBtn) {
      this.filterService.setSelectedFavourites(id).then(() => {
        this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
      });
    } else {
      this.filterService.deleteFromFavourite(id).then(() => {
        this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
      })
    }
  }

}
