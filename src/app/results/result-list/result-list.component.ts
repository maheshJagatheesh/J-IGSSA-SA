import { Component, OnInit, Input } from '@angular/core';
import { ResultModel } from 'src/app/Model/Results/Result.model';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})
export class ResultListComponent implements OnInit {
  @Input() resultData: ResultModel;
  @Input() showLabel;
  @Input() isLogedIn;
  showDate: boolean;
  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
    this.showDate = true;
    this.resultsService.showEventDate = true;
    if (this.resultData.dateHeader == this.resultsService.previousDate) {
      this.showDate = false;
      this.resultsService.showEventDate = false;
    }
    console.log(this.resultData);
  }

  ionViewWillEnter() {
    console.log(this.resultData);
  }

}
