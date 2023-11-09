import {
  Component,
  OnInit,
  AfterContentInit,
  OnChanges,
  DoCheck,
  AfterViewInit,
  AfterViewChecked,
  AfterContentChecked,
  OnDestroy,
  SimpleChanges
} from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CompetitionFilterComponent } from "../competition-filter/competition-filter.component";
import {
  CompetitionFilterService,
  competitionFilterConst
} from "../competition-filter/competition-filter.service";
import { Subscription, forkJoin } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-competition-filter-icon",
  templateUrl: "./competition-filter-icon.component.html",
  styleUrls: ["./competition-filter-icon.component.scss"]
})
export class CompetitionFilterIconComponent implements OnInit, OnDestroy {
  isEnabled: boolean;
  subscription: Subscription;
  isSubAssociationSelected: boolean;
  associationName: any;
  selectedSubAssociationName: string;
  competitionfilterData = [];
  showLabel: boolean;

  constructor(
    private modalCtrl: ModalController,
    private competitionFilterService: CompetitionFilterService,
    private routes: ActivatedRoute
  ) {
    this.isEnabled = false;
    this.isSubAssociationSelected = false;
    // this.competitionFilterService.getFilterData(competitionFilterConst.SUB_ASSOCIATION_FILTER).subscribe(
    //   data => {
    //     if (data && data.length > 1) {
    //       this.isEnabled = true;
    //     }
    //   }
    // )
  }


  ngOnInit() {
    this.routes.params.subscribe(data => {
      this.showLabel = false;
      // alert("dsd init")

      this.selectedSubAssociationName = null;

      this.subscription = forkJoin([
        this.competitionFilterService.getFilterData(
          competitionFilterConst.SUB_ASSOCIATION_FILTER
        ),
        this.competitionFilterService.getFilterData(
          competitionFilterConst.SELECTED_ASSOCIATION_ID
        )
      ]).subscribe(data => {
        if (data && data[0].length > 1) {
          this.competitionfilterData = data[0];
          this.isEnabled = true;
          if (!data[1]) {
            this.showCompetionFilter();
          } else {
            this.associationName = data[0].find(el => {
              return el.ASSOCIATIONID == data[1]
            })
            this.selectedSubAssociationName = this.associationName.ASSOCIATIONNAME;
            this.showLabel = true;
            console.log("this.associationName ", this.selectedSubAssociationName)
          }
        }
      });

      this.competitionFilterService.selectedAssociation.subscribe(data => {
        // this.selectedSubAssociationName = data;
        // this.associationName = this.competitionfilterData.map( el =>{
        //   if( el.ASSOCIATIONID == data){
        //     this.selectedSubAssociationName = el.ASSOCIATIONNAME;
        //   }
        // })

        this.associationName = this.competitionfilterData.find(el => {
          if (el.ASSOCIATIONID == data) {
            this.selectedSubAssociationName = el.ASSOCIATIONNAME;
            return el.ASSOCIATIONNAME;
          }
        })

        if (this.associationName && this.associationName.ASSOCIATIONNAME) {
          this.selectedSubAssociationName = this.associationName.ASSOCIATIONNAME;
          this.showLabel = true;
        }
      });
    })
  }

  showCompetionFilter() {
    this.modalCtrl
      .create({
        component: CompetitionFilterComponent,
        componentProps: {
          params: {
            eventId: 5
          }
        }
        // componentProps: { }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  ngOnDestroy() {
    this.showLabel = false;
    // this.subscription.unsubscribe();
  }
}
