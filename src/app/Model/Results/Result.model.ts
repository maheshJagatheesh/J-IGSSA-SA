export class ResultModel {
    constructor(
        public dateHeader: string,
        public gameGroup: GameGroup[]
    ) {
    }
}

class GameGroup {
    constructor(
        public eventGroup: EventGroup[],
        public sportName: string,
        public sportFlag: string,
        public clientName: string,
        public clientID: number

    ) { }

}

class EventGroup {
    constructor(
        public Date: string,
        public acceptProtestStatus: string,
        public awayClubId: string,
        public awayClubLogo: string,
        public awayClubName: string,
        public awayDivisionID: string,
        public awayDivisionName: string,
        public awayPoint: string,
        public awayScore: string,
        public awayTeamId: string,
        public awayTeamName: string,
        public clientID: string,
        public clientName: string,
        public eventId: string,
        public event_status: string,
        public homeClubId: string,
        public homeClubLogo: string,
        public homeClubName: string,
        public homeDivisionID: string,
        public homeDivisionName: string,
        public homePoint: string,
        public homeScore: string,
        public homeTeamId: string,
        public homeTeamName: string,
        public seeAllFlag: string,
        public showAcceptRejectButton: string,
        public sportFlag: string,
        public sportName: string,
        public tier2AwayScore: string,
        public tier2HomeScore: string,
        public liveScoring: number,
        public isLiveScoring: number,
        public liveStreaming_url: string,
        public isforfeitHome: number,
        public isforfeitAway: number
    ) { }
}

