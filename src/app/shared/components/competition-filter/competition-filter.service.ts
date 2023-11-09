import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterService } from '../../Filter/filter.service';
import { BehaviorSubject, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpOptions } from '../../api/api-call';
import { map, take, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

// const SUB_ASSOCIATION_FILTER = 'subAssociationFilter';
// const SELECTED_ASSOCIATION_ID = 'selectedAssociationId';

export const competitionFilterConst = {
  SUB_ASSOCIATION_FILTER: 'subAssociationFilter',
  SELECTED_ASSOCIATION_ID: 'selectedAssociationId',
};

export interface CompetitionFilterResponse {
  SUCCESS: boolean;
  GETFILTER: CompetitionFilterData[];
}

export class CompetitionFilterData {
  constructor(
    public ASSOCIATIONNAME: string,
    public ASSOCIATIONID: string,
    public ACTIVITY: CompetitionActivity[]
  ) {}
}
export class CompetitionActivity {
  constructor(public CLIENTID: string, public CLIENTNAME: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class CompetitionFilterService {
  private _competitionFilterData = new BehaviorSubject<CompetitionFilterData[]>(
    []
  );
  subAssociationFilterSelected = new EventEmitter<boolean>();
  private _selectedAssociation$ = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient, private filterservice: FilterService) {}

  get competitionFilterData() {
    return this._competitionFilterData.asObservable();
  }
  loadCompetitionFilter() {
    let body = new URLSearchParams();
    body.set('masterPersonId', environment.masterPersonId);

    return this.http
      .post<CompetitionFilterResponse>(
        environment.baseURL + 'teams/getCompetitionsFilter',
        body.toString(),
        httpOptions
      )
      .pipe(
        map((result) => {
          const competitionFilterData: CompetitionFilterData[] = [];
          for (let key in result.GETFILTER) {
            competitionFilterData.push(
              new CompetitionFilterData(
                result.GETFILTER[key].ASSOCIATIONNAME,
                result.GETFILTER[key].ASSOCIATIONID,
                result.GETFILTER[key].ACTIVITY
              )
            );
          }
          // console.log("Result ---", competitionFilterData);
          this.storeData(
            competitionFilterData,
            competitionFilterConst.SUB_ASSOCIATION_FILTER
          );
          if (competitionFilterData.length == 1) {
            this.filterservice.selectedAssociationId =
              competitionFilterData[0].ASSOCIATIONID;
          }
          return competitionFilterData;
        }),
        take(1),
        tap((result) => {
          this._competitionFilterData.next(result);
        })
      );
  }

  async selectedCompetition(associationID, isSelected) {
    if (isSelected) {
      this.setSelectedAssociation(associationID);
      this.storeData(
        associationID,
        competitionFilterConst.SELECTED_ASSOCIATION_ID
      );
      this.filterservice.selectedAssociationId = associationID;
    } else {
      this.removeStoredData(competitionFilterConst.SELECTED_ASSOCIATION_ID);
      this.filterservice.selectedAssociationId = 0;
    }
  }

  /**
   * set selectedAssociation$
   */
  setSelectedAssociation(selectedAssociation$) {
    // alert("set")
    this._selectedAssociation$.next(selectedAssociation$);
  }

  get selectedAssociation() {
    return this._selectedAssociation$.asObservable();
  }

  /**
   * Store sub-association filter data
   */
  storeData(data, key: string) {
    Storage.set({
      key: key,
      value: JSON.stringify(data),
    }).then(() => {});
  }

  /**
   * Remove sub-association filter data
   */
  removeStoredData(key: string) {
    Storage.remove({ key: key }).then(() => {});
  }

  /**
   *
   */
  getFilterData(key: string) {
    return from(Storage.get({ key: key })).pipe(
      map((storedData: any) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value);
        if (parsedData) {
          return parsedData;
        } else {
          return null;
        }
      })
    );
  }
}
