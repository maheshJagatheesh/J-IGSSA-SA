import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ResultsService } from '../results.service';

@Component({
  selector: 'app-result-by-category',
  templateUrl: './result-by-category.page.html',
  styleUrls: ['./result-by-category.page.scss'],
})
export class ResultByCategoryPage implements OnInit {
  resultList = [];

  perPage: number;
  recordCount: number;
  offset: number;
  itemsLoaded: number;
  loadFilter: boolean;
  isLoading = false;
  divisionId;

  constructor(
    private menuCntrl: MenuController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private resultService: ResultsService
  ) { }

  ngOnInit() {
    this.offset = 0;
    this.resultList = [];
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('resultId')) {
        this.navCtrl.navigateBack('/home/tabs/results');
        return;
      }
      this.divisionId = paramMap.get('resultId');
      this.isLoading = true;
      this.getResultListByDivision(paramMap.get('resultId')).then(() => {
        this.isLoading = false;
        console.log("Loading ends...");
      });

    })
  }

  ionViewWillEnter() {
    this.resultService.previousDate = null;
    this.resultService.previousSport = null;
    this.offset = 0;
    // this.resultList = [];
    console.log("viewWillEnter res-by-cat");
    this.menuCntrl.enable(false);
  }

  toggleFilter() {
    this.menuCntrl.toggle()
  }

  getResultListByDivision(division_id) {

    return new Promise((resolve, reject) => {

      this.resultService.getResultListByDivision(division_id, this.offset).subscribe(data => {
        console.log(data);
        // this.resultList = data.resultList;

        if (this.offset > 0) {
          this.resultService.previousDate = this.resultList[this.resultList.length - 1].dateHeader;
          this.resultService.previousSport = this.resultList[this.resultList.length - 1].gameGroup[this.resultList[this.resultList.length - 1].gameGroup.length - 1].sportName;
        }

        if (this.offset == 0) {
          this.resultList = [];
        }
        this.resultList = this.resultList.concat(data.resultList);

        this.recordCount = data.totalRecords;
        this.perPage = data.fetchRecords;
        this.itemsLoaded = data.currentRows;

        resolve();
      }, error => {
        console.log("getResultListByDivision ERROR !!!", error);
        reject();
      });
    })
  }

  loadData(event) {
    this.offset++;

    console.log('this.perPage', this.perPage)
    console.log('this.itemsLoaded', this.itemsLoaded)

    if (this.perPage == this.itemsLoaded) {

      this.getResultListByDivision(this.divisionId).then(
        () => {
          event.target.complete();
          if (this.perPage != this.itemsLoaded) {
            event.target.disabled = true;
          }
        }

      )

    } else {
      event.target.disabled = true;
    }

  }

}
