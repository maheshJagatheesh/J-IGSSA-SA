import { Injectable, EventEmitter } from '@angular/core';
import { FilterModel } from 'src/app/Model/Filter/Filter.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { promise } from 'protractor';

export interface FilterData {
  favouriteTeamList: any[];
  divivsionList: any[];
  schoolList: any[];
  roundList: any[];
  sportList: any[];
}

export interface SelectedFilter {
  favouriteTeamList: any[];
  divivsionList: any[];
  schoolList: any[];
  roundList: any[];
  sportList: any[];
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public _testSub = new Subject<any>();
  public _filterData = new Subject<FilterData>();
  public _selectedFilterData = new BehaviorSubject<SelectedFilter>({
    favouriteTeamList: [],
    divivsionList: [],
    schoolList: [],
    roundList: [],
    sportList: [],
  });

  loadFilter = new EventEmitter<{ flag: boolean; page: number }>();
  filterChanged = new EventEmitter<{ flag: boolean; page: number }>();
  checkFilterStatus = new Subject<boolean>();

  public _page = new Subject<number>();

  selectedFavourites = [];
  selectedSports = [];
  selectedDivision = [];
  selectedSchools = [];
  selectedRounds = [];
  selectedAssociationId;

  constructor() {}

  /**
   * get
   */
  get testSub() {
    return this._testSub.asObservable();
  }
  settestSub(sub) {
    this._testSub.next(sub);
  }

  /**
   * get filter data loaded from API
   */
  get filterData() {
    return this._filterData.asObservable();
  }

  setFilterData(data: FilterData) {
    this._filterData.next(data);
  }

  /**
   * Get selected filter data
   */
  get selectedFilterData() {
    return this._selectedFilterData.asObservable();
  }

  get page() {
    return this._page.asObservable();
  }

  setPage(page) {
    this._page.next(page);
  }

  clearFilter() {
    this.selectedFavourites = [];
    this.selectedSports = [];
    this.selectedDivision = [];
    this.selectedSchools = [];
    this.selectedRounds = [];

    this.checkFilterStatus.next(true);

    this._selectedFilterData.next({
      favouriteTeamList: [],
      divivsionList: [],
      schoolList: [],
      roundList: [],
      sportList: [],
    });

    this.setFilterData({
      divivsionList: [],
      favouriteTeamList: [],
      roundList: [],
      schoolList: [],
      sportList: [],
    });
    // this._filterData.next(new FilterModel([], [], [], [], []));
  }

  async setSelectedFavourites(teamId) {
    let id = +teamId;
    if (!this.selectedFavourites.includes(id)) {
      this.selectedFavourites.push(id);
      this._selectedFilterData.next({
        ...this._selectedFilterData.value,
        favouriteTeamList: this.selectedFavourites,
      });
    }
  }

  async deleteFromFavourite(id) {
    let index = this.selectedFavourites.indexOf(id);
    console.log('splice - id' + index);
    this.selectedFavourites.splice(index, 1);
    this._selectedFilterData.next({
      ...this._selectedFilterData.value,
      favouriteTeamList: this.selectedFavourites,
    });
  }

  /* -- Sports -- */
  async setSelectedSports(id) {
    if (!this.selectedSports.includes(id)) {
      this.selectedSports.push(id);
      this._selectedFilterData.next({
        ...this._selectedFilterData.value,
        sportList: this.selectedSports,
      });
    }
  }

  async deleteSelectedSports(id) {
    let index = this.selectedSports.indexOf(id);
    console.log('splice - id' + index);
    this.selectedSports.splice(index, 1);
    this._selectedFilterData.next({
      ...this._selectedFilterData.value,
      sportList: this.selectedSports,
    });
  }

  /*-- Division-- */

  async setSelectedDivision(id) {
    if (!this.selectedDivision.includes(id)) {
      this.selectedDivision.push(id);
      this._selectedFilterData.next({
        ...this._selectedFilterData.value,
        divivsionList: this.selectedDivision,
      });
    }
  }

  async deleteSelectedDivision(id) {
    let index = this.selectedDivision.indexOf(id);
    console.log('splice - id' + index);
    this.selectedDivision.splice(index, 1);
    this._selectedFilterData.next({
      ...this._selectedFilterData.value,
      divivsionList: this.selectedDivision,
    });
  }

  /*-- Schools-- */

  async setSelectedSchools(id) {
    if (!this.selectedSchools.includes(id)) {
      this.selectedSchools.push(id);
      this._selectedFilterData.next({
        ...this._selectedFilterData.value,
        schoolList: this.selectedSchools,
      });
    }
  }

  async deleteSelectedSchools(id) {
    let index = this.selectedSchools.indexOf(id);
    console.log('splice - id' + index);
    this.selectedSchools.splice(index, 1);
    this._selectedFilterData.next({
      ...this._selectedFilterData.value,
      schoolList: this.selectedSchools,
    });
  }

  /*-- Rounds-- */

  async setSelectedRounds(id) {
    if (!this.selectedRounds.includes(id)) {
      this.selectedRounds.push(id);
      this._selectedFilterData.next({
        ...this._selectedFilterData.value,
        roundList: this.selectedRounds,
      });
    }
  }

  async deleteSelectedRounds(id) {
    let index = this.selectedRounds.indexOf(id);
    console.log('splice - id' + index);
    this.selectedRounds.splice(index, 1);
    this._selectedFilterData.next({
      ...this._selectedFilterData.value,
      roundList: this.selectedRounds,
    });
  }

  selecteAllDivisions(divisionIds: any[], isChecked) {
    return new Promise<void>((res, rej) => {
      divisionIds.map((el) => {
        if (isChecked) {
          this.setSelectedDivision(el.DIVISIONID);
        } else {
          this.deleteSelectedDivision(el.DIVISIONID);
        }
      });
      console.log('elements-- ends');
      res();
    });
  }
}
