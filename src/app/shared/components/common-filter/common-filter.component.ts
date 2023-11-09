import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FilterService } from './../../Filter/filter.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss'],
})
export class CommonFilterComponent implements OnInit, OnDestroy {

  isAnyFilterChoosen: boolean = false
  subscription: Subscription
  constructor(
    private menuCntrl: MenuController,
    private filterService: FilterService
  ) { }

  ngOnInit() {
    // this.subscription = this.filterService.checkFilterStatus.subscribe(data => {
    this.subscription = this.filterService.selectedFilterData.subscribe(data => {
      console.log('Result ...', data)
      if (data && data.divivsionList.length || data.favouriteTeamList.length || data.roundList.length || data.schoolList.length || data.sportList.length) {
        // if (data) {
        console.log("selected")
        this.isAnyFilterChoosen = true;
      } else {
        console.log("not selected")
        this.isAnyFilterChoosen = false;
      }
    })
  }

  toggleFilter() {
    this.menuCntrl.toggle()
  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
  }
}
