import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CompetitionFilterService, competitionFilterConst } from '../competition-filter.service';
import { FilterService } from 'src/app/shared/Filter/filter.service';

@Component({
  selector: 'app-filter-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss'],
})
export class FilterLabelComponent implements OnInit {
  @Input() competition;
  @Input() selectedID;
  isSelected: boolean;
  constructor(
    private modalCtrl: ModalController,
    private competitionFilterService: CompetitionFilterService,
    private filterservice: FilterService
  ) { }

  ngOnInit() {
    this.isSelected = false;
    // if (this.selectedID == this.competition.ASSOCIATIONID) {
    //   this.isSelected = true;
    // }

    if (this.filterservice.selectedAssociationId == this.competition.ASSOCIATIONID) {
      this.isSelected = true;
    }
  }

  // toggleSelection(associationId) {
  //   this.isSelected = !this.isSelected;
  // }

  closeFilter() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  toggleSelection(associationId) {
    if (!this.isSelected) {

      this.isSelected = !this.isSelected;
      this.competitionFilterService.selectedCompetition(associationId, this.isSelected).then(data => {

        this.competitionFilterService.subAssociationFilterSelected.emit(true);
        this.closeFilter();
      }
      );
    }
  }

}
