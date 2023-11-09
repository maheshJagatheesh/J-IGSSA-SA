import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-game-type',
  templateUrl: './game-type.component.html',
  styleUrls: ['./game-type.component.scss'],
})
export class GameTypeComponent implements OnInit {
  @Input() game;
  showMore = false;
  imgBaseUrl = environment.logoImgPath;
  constructor() { }

  ngOnInit() { }

  showDetails() {
    this.showMore = !this.showMore;
  }

}
