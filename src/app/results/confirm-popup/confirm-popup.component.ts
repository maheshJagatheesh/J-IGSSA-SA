import { Component, OnInit, Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ResultsService } from '../results.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent implements OnInit {
  @Input() eventId;
  @Input() acceptProtest;
  firebaseAnalytics: any;
  constructor(
    private modalCtrl: ModalController,
    private resultServise: ResultsService
  ) {}

  ngOnInit() {}

  onConfirm() {
    console.log(this.eventId);
    console.log(this.acceptProtest);

    this.resultServise
      .acceptOrProtest(this.acceptProtest, this.eventId)
      .subscribe(
        (data) => {
          if (Capacitor.isNativePlatform()) {
            FirebaseAnalytics.setCollectionEnabled({
              enabled: true,
            });
            if (this.acceptProtest) {
              FirebaseAnalytics.logEvent({
                name: 'Score_accepted',
                params: {
                  event_id: this.eventId,
                },
              })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            } else {
              FirebaseAnalytics.logEvent({
                name: 'Score_rejected',
                params: {
                  event_id: this.eventId,
                },
              })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
          }
          console.log(data);
          this.resultServise.loadResult.emit(true);
          this.resultServise
            .sendNotificationToCoach(this.acceptProtest, this.eventId)
            .subscribe(
              (data) => {
                console.log('Coach Notification API', 'API Successfull');
                this.onCancel();
              },
              (error) => {
                console.log('Coach Notification API', 'API Failed');
                this.onCancel();
              }
            );
        },
        (error) => {
          this.onCancel();
        }
      );
    // this.onCancel();
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
