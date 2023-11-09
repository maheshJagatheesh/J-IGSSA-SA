export class FilterModel {
  constructor(
    public favouriteTeamList: FavouriteTeamList[],
    public divivsionList: DivivsionList[],
    public schoolList: SchoolList[],
    public roundList: RoundList[],
    public sportList: SportList[]
  ) {}
}

export class DivivsionList {
  constructor(public division_id: number, public division_name: string) {}
}

export class SchoolList {
  constructor(
    public club_name: string,
    public club_name_short: string,
    public club_id: string
  ) {}
}

export class RoundList {
  constructor(public gameround: string) {}
}

export class SportList {
  constructor(
    public client_id: number,
    public client_name: string,
    public divisionList: any
  ) {}
}

export class FavouriteTeamList {
  constructor(
    public favouriteTeamId: number,
    public clubSuburb: string,
    public teamName: string,
    public person_id: number,
    public clubId: number,
    public clubName: string,
    public clientLogo: string,
    public logopath: string,
    public clientId: number,
    public clientName: string,
    public clubDivisionId: number
  ) {}
}
