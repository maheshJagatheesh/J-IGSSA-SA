import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { CompetitionFilterService, competitionFilterConst } from './competition-filter.service';
import { forkJoin } from 'rxjs';
import { FilterService } from '../../Filter/filter.service';


@Component({
  selector: 'app-competition-filter',
  templateUrl: './competition-filter.component.html',
  styleUrls: ['./competition-filter.component.scss'],
})
export class CompetitionFilterComponent implements OnInit {
  competitionFilterData = [];
  selectedID = 0;

  constructor(
    private modalCtrl: ModalController,
    private competitionFilterService: CompetitionFilterService,
    private platform:Platform,
    private filterservice: FilterService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // this.competitionFilterService.getFilterData(competitionFilterConst.SUB_ASSOCIATION_FILTER).subscribe(result => {
    //   // console.log("saved -- result ", result);
    //   this.competitionFilterData = result;
    // });

    forkJoin([
      this.competitionFilterService.getFilterData(competitionFilterConst.SUB_ASSOCIATION_FILTER),
      this.competitionFilterService.getFilterData(competitionFilterConst.SELECTED_ASSOCIATION_ID)
    ]).subscribe(result => {
      console.log("res fork--- ", result);
      this.competitionFilterData = result[0];
      this.selectedID = result[1]
    })
  }

  closeFilter() {

    console.log("SubAsso",this.filterservice.selectedAssociationId)

    if(this.filterservice.selectedAssociationId){

      this.modalCtrl.dismiss({
        'dismissed': true
      });

    }else {

      this.presentToast('Please choose at least one sub association')
      
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
