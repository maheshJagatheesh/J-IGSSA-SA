import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-common-notification',
  templateUrl: './common-notification.component.html',
  styleUrls: ['./common-notification.component.scss'],
})
export class CommonNotificationComponent implements OnInit {

  showMoreTab:boolean = false;
  showActiveIcon: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.showMoreTab = environment.showMoreTab;

    console.log(this.router.url.split('/')[3]);
    const urlSeget = this.router.url.split('/')[3];
    if (urlSeget === 'notification') {
      this.showActiveIcon = true;
    }
  }


  showNotifications() {
    this.router.navigateByUrl('home/tabs/notification');
    // alert('You\'ve clicked notifications');
  }
}
