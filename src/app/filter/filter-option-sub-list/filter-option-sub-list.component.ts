import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterService } from 'src/app/shared/Filter/filter.service';
import { FixtureService } from 'src/app/fixtures/fixture.service';
import { Subject } from 'rxjs';

export interface OptionToggle {
  isChecked: boolean;
  id: number;
}

@Component({
  selector: 'app-filter-option-sub-list',
  templateUrl: './filter-option-sub-list.component.html',
  styleUrls: ['./filter-option-sub-list.component.scss'],
})
export class FilterOptionSubListComponent implements OnInit {
  @Input() data;
  @Input() isSubChecked: Subject<any>;
  @Input() currentPage;
  @Output() onChangeSelection = new EventEmitter<OptionToggle>();
  isChecked = false;

  constructor(
    private filterService: FilterService,
    private fixtureService: FixtureService
  ) {}

  ngOnInit() {
    switch (this.data.type) {
      case 2:
        // console.log("type --" + this.data.type);
        if (this.filterService.selectedSports.includes(this.data.id))
          this.isChecked = true;
        break;
      case 3:
        // console.log("type --" + this.data.type);
        this.isSubChecked.subscribe((data) => {
          this.isChecked = data;
        });
        if (this.filterService.selectedDivision.includes(this.data.id)) {
          this.isChecked = true;
        }
        break;
      case 4:
        // console.log("type --" + this.data.type);
        if (this.filterService.selectedSchools.includes(this.data.id))
          this.isChecked = true;
        break;
      case 5:
        // console.log("type --" + this.data.type);
        if (this.filterService.selectedRounds.includes(this.data.id))
          this.isChecked = true;
        break;
    }

    // if( this.filterService. )
  }

  toggleOption(id) {
    switch (this.data.type) {
      case 2:
        // console.log("type --" + this.data.type);
        if (!this.isChecked) {
          this.isChecked = true;
          this.filterService.setSelectedSports(id).then(() => {
            // console.log("Added sports");
            this.onChangeSelection.emit({ isChecked: this.isChecked, id: id });
            // this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
          });
        } else {
          this.isChecked = false;
          this.filterService.deleteSelectedSports(id).then(() => {
            // console.log("delete sports");
            this.onChangeSelection.emit({ isChecked: this.isChecked, id: id });
            // this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
          });
        }
        break;
      case 3:
        // console.log("type --" + this.data.type);

        if (!this.isChecked) {
          this.isChecked = true;
          this.filterService.setSelectedDivision(id).then(() => {
            // console.log("Added division");
            this.onChangeSelection.emit({ isChecked: this.isChecked, id: id });
            // this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
          });
        } else {
          this.isChecked = false;
          this.filterService.deleteSelectedDivision(id).then(() => {
            // console.log("delete division");
            this.onChangeSelection.emit({ isChecked: this.isChecked, id: id });
            // this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
          });
        }

        break;
      case 4:
        // console.log("type --" + this.data.type);

        if (!this.isChecked) {
          this.isChecked = true;
          this.filterService.setSelectedSchools(id).then(() => {
            // console.log("Added school");
            this.onChangeSelection.emit({ isChecked: this.isChecked, id: id });
            // this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
          });
        } else {
          this.isChecked = false;
          this.filterService.deleteSelectedSchools(id).then(() => {
            // console.log("delete school");
            this.onChangeSelection.emit({ isChecked: this.isChecked, id: id });
            // this.filterService.filterChanged.emit({ flag: true, page: this.currentPage });
          });
        }

        break;
      case 5:
        // console.log("type --" + this.data.type);

        if (!this.isChecked) {
          this.isChecked = true;
          this.filterService.setSelectedRounds(id).then(() => {
            // console.log("Added rounds");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        } else {
          this.isChecked = false;
          this.filterService.deleteSelectedRounds(id).then(() => {
            // console.log("delete rounds");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        }

        break;
    }
  }
}
