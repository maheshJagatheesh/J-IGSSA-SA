import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-team-tile',
  templateUrl: './team-tile.component.html',
  styleUrls: ['./team-tile.component.scss'],
})
export class TeamTileComponent implements OnInit {
  @Input() team;
  imgBaseUrl = environment.logoImgPath;
  constructor() { }

  ngOnInit() { }

}
