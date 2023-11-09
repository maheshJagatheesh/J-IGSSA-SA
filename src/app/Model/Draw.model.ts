export class DrawModel {
    constructor(
        public round: number,
        public Draw_data: DrawData[]
  
    ) { }
  }

  class DrawData {
    constructor(
        public date_schedule: string,
        public fixture_details: FixtureListData[]
    ){}
  }
  
  class FixtureListData {
    constructor(
        public date_started: string,
        public simple_home_score: string,
        public simple_away_score: string,
        public event_name: string,
        public client_name: string,
        public round: number,
        public ground_name: string,
        public awayLogoPath: string,
        public teamhome_name: string,
        public homeLogoPath: string,
        public eventType: number,
        public event_status: string,
        public event_id: number,
        public division_name: string,
        public teamaway_name: string,
        public time_started: string,
    ) { }
  }