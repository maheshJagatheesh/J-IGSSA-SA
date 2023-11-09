import { Component, OnInit, Input } from '@angular/core';
import { FilterService } from 'src/app/shared/Filter/filter.service';
import { FixtureService } from 'src/app/fixtures/fixture.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss'],
})
export class FilterOptionComponent implements OnInit {
  @Input() data;
  @Input() currentPage;
  isSubChecked: Subject<any> = new Subject();
  isChecked = false;
  divisionIds: number[];
  constructor(
    private filterService: FilterService,
    private fixtureService: FixtureService
  ) {}

  ngOnInit() {
    switch (this.data.type) {
      case 2:
        // console.log("type --" + this.data.type);
        this.divisionIds = [];
        this.data.data.map((el) => {
          // console.log("el ....", el)
          this.divisionIds.push(el.DIVISIONID);
        });

        if (this.filterService.selectedSports.includes(this.data.id))
          this.isChecked = true;
        break;
      case 3:
        // console.log("type --" + this.data.type);
        if (this.filterService.selectedDivision.includes(this.data.id))
          this.isChecked = true;
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
  onChangeSelectionChild(event) {
    // console.log(event)
    if (!event.isChecked && this.data.type == 2) {
      let found = this.divisionIds.some((el) =>
        this.filterService.selectedDivision.includes(el)
      );
      if (!found) {
        this.isChecked = false;
        this.filterService.deleteSelectedSports(this.data.id).then(() => {
          this.filterService.filterChanged.emit({
            flag: true,
            page: this.currentPage,
          });
        });
      } else {
        this.filterService.filterChanged.emit({
          flag: true,
          page: this.currentPage,
        });
      }
    }
  }

  toggleOption(id) {
    switch (this.data.type) {
      case 2:
        // console.log("type --" + this.data.type);
        // console.log("Sport---div", this.data.data);
        if (!this.isChecked) {
          this.isChecked = true;
          this.isSubChecked.next(this.isChecked);
          this.filterService
            .selecteAllDivisions(this.data.data, this.isChecked)
            .then(() => {
              // console.log("Completed...")
            });
          this.filterService.setSelectedSports(id).then(() => {
            // console.log("Added sports");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        } else {
          this.isChecked = false;
          this.isSubChecked.next(this.isChecked);
          this.filterService
            .selecteAllDivisions(this.data.data, this.isChecked)
            .then(() => {
              // console.log("Completed...")
            });
          this.filterService.deleteSelectedSports(id).then(() => {
            // console.log("delete sports");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        }
        break;
      case 3:
        // console.log("type --" + this.data.type);

        if (!this.isChecked) {
          this.isChecked = true;
          this.filterService.setSelectedDivision(id).then(() => {
            // console.log("Added division");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        } else {
          this.isChecked = false;
          this.filterService.deleteSelectedDivision(id).then(() => {
            // console.log("delete division");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        }

        break;
      case 4:
        // console.log("type --" + this.data.type);

        if (!this.isChecked) {
          this.isChecked = true;
          this.filterService.setSelectedSchools(id).then(() => {
            // console.log("Added school");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
          });
        } else {
          this.isChecked = false;
          this.filterService.deleteSelectedSchools(id).then(() => {
            // console.log("delete school");
            this.filterService.filterChanged.emit({
              flag: true,
              page: this.currentPage,
            });
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
