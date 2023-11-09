export class TeamByClubModel {
    constructor(
        public FAVOURITETEAM: any[],
        public SUCCESS: boolean,
        public CLUBLOGO: string,
        public GETTEAMBYCLUB: TeamByClub[]
    ) { }



}

export class TeamByClub {
    constructor(
        public client_id: number,
        public client_name: string,
        public client_logo: string,
        public teamList: TeamList[]
    ) { }
}

export class TeamList {
    constructor(
        public team_name: string,
        public club_division_id: number,
        public isFavorite: number
    ) { }
}