import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { NotificationService } from '../notifications/notification.service';
import { DeviceService } from '../shared/device/device.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications = [];
  constructor(
    private menuCntrl: MenuController,
    private notificationService: NotificationService,
    private loadingController: LoadingController,
    private deviceService: DeviceService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCntrl.enable(false);
  }

  toggleFilter() {
    this.menuCntrl.toggle()
  }

  segmentChanged(ev: any) {
    // console.log(ev.detail.value);
    switch (ev.detail.value) {
      case 'myTeams':
        this.loadMyTeamNotification();
        break;
      case 'all':
        this.loadAllNotification();
        break;
    }
  }

  loadMyTeamNotification() {
    this.loadingController.create({ keyboardClose: true, message: '' }).then(loadingEl => {
      loadingEl.present();

      this.deviceService.getDeviceId().then(data => {
        // console.log("Device Id");
        // console.log("Device Id" + data.uuid);
        // console.log("Device Id" + data.manufacturer);
        // console.log("Device Id" + data.model);

        this.notificationService.loadMyTeamNotification(data.uuid, data.manufacturer, 1, 0)
          .subscribe(data => {
            this.notifications = data.GETGROUPMESSAGE
            loadingEl.dismiss();
            // console.log(data);
          })
      })
    })
  }

  loadAllNotification() {

    this.loadingController.create({ keyboardClose: true, message: '' }).then(loadingEl => {
      loadingEl.present();

      this.notificationService.loadAllNotification(0)
        .subscribe(data => {
          this.notifications = data.GETGROUPMESSAGE
          loadingEl.dismiss();
          console.log(data);
        })
    })

  }

}
