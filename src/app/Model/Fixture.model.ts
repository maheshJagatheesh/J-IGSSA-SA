export class FixtureModel {
  constructor(
    public date_schedule: string,
    public fixture_details: FixtureListData[],
    public EVENTDISPLAYTYPE: string

  ) { }
}

class FixtureListData {
  constructor(
    public date_started: string,
    public event_address: string,
    public event_name: string,
    public client_name: string,
    public ground_name: string,
    public awayLogoPath: string,
    public teamhome_name: string,
    public homeLogoPath: string,
    public event_state: string,
    public showScoreButton: string,
    public event_status_id: string,
    public event_postcode: string,
    public event_status: string,
    public event_id: number,
    public division_name: string,
    public teamaway_name: string,
    public time_started: string,
    public longitude: number,
    public latitude: number,
    public sport_id: number,
    public liveStreaming_url: string,
    public liveScoring: number
  ) { }
}
