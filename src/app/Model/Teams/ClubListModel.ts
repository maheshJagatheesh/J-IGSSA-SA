import { ClubList } from './ClubList';

export class ClubListModel {
    constructor(
        public SUCCESS: boolean,
        public GETCLUBLIST: ClubList[]

    ){}
}