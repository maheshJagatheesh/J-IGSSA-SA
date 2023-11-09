import { FixtureModel } from '../Model/Fixture.model';
import { DrawModel } from '../Model/Draw.model'
import { DivivsionList, SchoolList, RoundList, SportList, FavouriteTeamList } from './Filter/Filter.model';
export class FixtureDetails {
    constructor(
        public GETFILTERTEAMLIST: FavouriteTeamList[],
        public GETFIXTURELIST: FixtureModel[],
        public SUCCESS: boolean,
        public GETFILTERDIVISIONLIST: DivivsionList[],
        public GETFILTERSCHOOLLIST: SchoolList[],
        public GETFILTERROUNDLIST: RoundList[],
        public GETFILTERSPORTLIST: SportList[],
        public TOTALRECORDS: number,
        public FETCHRECORDS: number,
        public CURRENTROWS: number
    ) { }
}


export class DrawDetails {
    constructor(
        public GETFILTERTEAMLIST: FavouriteTeamList[],
        public GETFIXTURELIST: DrawModel[],
        public SUCCESS: boolean,
        public GETFILTERDIVISIONLIST: DivivsionList[],
        public GETFILTERSCHOOLLIST: SchoolList[],
        public GETFILTERROUNDLIST: RoundList[],
        public GETFILTERSPORTLIST: SportList[],
        public TOTALRECORDS: number,
        public FETCHRECORDS: number,
        public CURRENTROWS: number
    ) { }
}

// class FilterDivision{
//     constructor(
//         public division_id: number,
//         public division_name: string
//     ){}
// }

// class FilterSchoolList{
//     constructor(
//         public club_name: string,
//         public club_name_short: string,
//         public club_id: number,
//     ){        
//     }
// }