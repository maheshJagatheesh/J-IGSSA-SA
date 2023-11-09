import { ResultModel } from './Result.model';

export class ResultList {
    constructor(
        public SUCCESS: boolean,
        public GETRESULTLIST: ResultModel[],
        public GETFILTERTEAMLIST: [],
        public NEVIGATE: [],
        public SPORTSLIST: [],
        public DIVISIONLIST: [],
        public SCHOOLLIST: [],
        public ROUNDLIST: [],
        public TOTALRECORDS: number,
        public FETCHRECORDS: number,
        public CURRENTROWS: number
    ) {

    }
}