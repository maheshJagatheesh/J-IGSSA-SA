import { Component, OnInit, Input } from '@angular/core';
import { ResultsService } from '../../results.service';

@Component({
  selector: 'app-result-category-list',
  templateUrl: './result-category-list.component.html',
  styleUrls: ['./result-category-list.component.scss'],
})
export class ResultCategoryListComponent implements OnInit {
  @Input() result;
  showDate: boolean;
  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
    this.showDate = true;
    this.resultsService.showsportName = true;
    if (this.result.dateHeader == this.resultsService.previousDate) {
      this.showDate = false;
      this.resultsService.showsportName = false;
    }
  }

}
