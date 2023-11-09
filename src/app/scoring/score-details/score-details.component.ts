import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-score-details',
  templateUrl: './score-details.component.html',
  styleUrls: ['./score-details.component.scss'],
})
export class ScoreDetailsComponent implements OnInit {
  @Input() fixture;
  @Input() isLogedIn;

  constructor() { }

  ngOnInit() { }

}
