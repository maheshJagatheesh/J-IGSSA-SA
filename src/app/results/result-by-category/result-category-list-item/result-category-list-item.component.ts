import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResultsService } from '../../results.service';
import { ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-result-category-list-item',
  templateUrl: './result-category-list-item.component.html',
  styleUrls: ['./result-category-list-item.component.scss'],
})
export class ResultCategoryListItemComponent implements OnInit {
  @Input() resulList;
  imgBaseUrl = environment.logoImgPath;
  isLoading: boolean = true;
  showSportLabel: boolean = true;
  showLabel: boolean = true;

  constructor(
    private resultsService: ResultsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    console.log('res ---', this.resulList);
    this.isLoading = false;
    this.showSportLabel = this.resultsService.showsportName;
  }

  // async openLiveStreamURL(urlToLoad) {

  //   Browser.open({url: urlToLoad});
  // }
  async openLiveStreamURL(urlToLoad) {
    const reg =
      '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$';
    if (urlToLoad.match(reg)) {
      await Browser.open({ url: urlToLoad });
    } else {
      this.presentToast('Invalid URL');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
