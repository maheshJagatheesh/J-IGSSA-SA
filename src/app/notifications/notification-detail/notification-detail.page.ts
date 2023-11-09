import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.page.html',
  styleUrls: ['./notification-detail.page.scss'],
})
export class NotificationDetailPage implements OnInit {

  news: {
    message: string,
    image_sent: string,
    senderLastName: string,
    messageTime: string,
    senderFirstName: string,
    messageDate: string,
    sender_id: string,
    eventName: string,
    receiver_id: string,
    id: string,
    isPushNotificationRead: string,
    sender_image: string,
  } = null;
  isLoading: boolean;
  constructor(
    private menuCntrl: MenuController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isLoading = false;
    this.fetchNotificationDetails();
    this.menuCntrl.enable(false);
  }

  toggleFilter() {
    this.menuCntrl.toggle()
  }

  fetchNotificationDetails() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('newsId')) {
        this.notificationService.loadNotificationDetails(paramMap.get('newsId')).subscribe(data => {
          this.news = data.GETGROUPMESSAGE[0];
          this.isLoading = false;
          console.log(this.news);
        });
      } else {
        this.navCtrl.navigateBack('/home/tabs/notification');
      }
      // console.log(paramMap);

    })
  }

}
