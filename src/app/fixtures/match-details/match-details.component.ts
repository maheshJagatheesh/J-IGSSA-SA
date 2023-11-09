import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { FixtureModel } from '../../Model/Fixture.model';
import { GoogleMapService } from 'src/app/shared/map/google-map.service';
import { FixtureService } from '../fixture.service';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss'],
})
export class MatchDetailsComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('mapView') mapElementRef: ElementRef;
  @Input() fixture;
  @Input() draw;
  @Input() isLogedIn;
  showMap = false;
  getGoogleMap: any;
  showDate: boolean;

  // title: string = 'My first AGM project';
  // lat: number = 51.678418;
  // lng: number = 7.809007;

  // zoom: number = 16;


  constructor(
    private googleMapService: GoogleMapService,
    private renderer: Renderer2,
    private fixtureService: FixtureService
  ) { }

  ngOnInit() {
    // this.getGoogleMap = this.googleMapService.getGoogleMaps();

  }

  ngOnChanges() {
    // console.log("fixture...", this.fixture)
    // console.log("draw...", this.draw)
    // console.log("Date sch...", this.fixtureService.previousDateSchedule)

    this.showDate = true;
    if (this.fixture && this.fixture.date_schedule == this.fixtureService.previousDateSchedule) {
      this.showDate = false;
    }

    // console.log("fixture...", this.fixture)
    // console.log("draw...", this.draw)

    if (this.fixtureService.previousDateSchedule && this.draw && this.draw.date_schedule == this.fixtureService.previousDateSchedule) {
      this.showDate = false;
    }
  }

  toggleMapView() {
    this.showMap = !this.showMap;
  }

  ngAfterViewInit() {

  }
}
