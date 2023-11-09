import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isNull } from '@angular/compiler/src/output/output_ast';
import {
  LoadingController,
  AlertController,
  ToastController,
  MenuController,
} from '@ionic/angular';
import { PushNotificationService } from '../shared/push-notification.service';
import { DeviceService } from '../shared/device/device.service';
import { Capacitor } from '@capacitor/core';
import { Storage } from '@capacitor/storage';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../shared/user/user.service';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private menuCntrl: MenuController,
    private pushNotificationService: PushNotificationService,
    private deviceService: DeviceService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    });
  }

  ionViewWillEnter() {
    this.menuCntrl.enable(false);
  }

  validateUser() {
    if (!this.form.valid) {
      let errorMsg = '';
      if (!this.form.value.username || !this.form.value.password) {
        // console.log("Empty...");
        if (!this.form.value.username && !this.form.value.password) {
          errorMsg = 'Enter Username and password.';
        } else if (!this.form.value.username) {
          errorMsg = 'Enter Username.';
          // console.log("else if...");
        } else {
          errorMsg = 'Enter Password.';
          // console.log("else   ...");
        }
      }
      this.presentToast(errorMsg);
      return;
    } else {
      this.loadingController
        .create({ keyboardClose: true, message: '' })
        .then((loadingEl) => {
          loadingEl.present();

          this.loginService.validateUser(this.form.value).subscribe(
            (data) => {
              // console.log("validateUser data===> ", data);
              loadingEl.dismiss();
              if (data) {
                this.registerCoachDevice();
                if (Capacitor.isNativePlatform()) {
                  FirebaseAnalytics.setCollectionEnabled({
                    enabled: true,
                  });
                  FirebaseAnalytics.setUserProperty({
                    name: 'Logged_in',
                    value: data.clientId.toString(),
                  })
                    .then((res: any) => console.log(res))
                    .catch((error: any) => console.error(error));
                  FirebaseAnalytics.logEvent({
                    name: 'Login',
                    params: {
                      client_id: data.clientId,
                    },
                  })
                    .then((res: any) => console.log(res))
                    .catch((error: any) => console.error(error));
                }

                // this.router.navigateByUrl('/landing-page');
              } else {
                this.showAlert('Invalid Username Or Password');
                // console.log("Invalid user....");
              }
            },
            (error) => {
              loadingEl.dismiss();
              this.showAlert('Something went wrog.');
            }
          );
        });
    }
  }

  goForgotPassword() {
    this.router.navigateByUrl('/reset-password');
  }

  goBack() {
    this.router.navigateByUrl('/entry');
  }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  registerCoachDevice() {
    let deviceId = this.deviceService.getDeviceId();
    let fcm = Storage.get({ key: 'FCMToken' });
    fcm.then((token) => {
      // console.log('Login FCM token ...', token);
    });
    Promise.all([deviceId, fcm]).then((result) => {
      // console.log('Res...', result);
      this.pushNotificationService
        .setDeviceToken(result[0].uuid, result[0].model, result[1].value)
        .subscribe((data) => {
          // console.log('User Reg setup...', data);
          this.router.navigateByUrl('/landing-page');
          // console.log("Device token",JSON.stringify(storedToken.value));
        });
    });

    // this.deviceService.getDeviceId().then(data => {

    //   console.log("Device UUID",data.uuid);

    //   Plugins.Storage.get({ key: 'FCMToken' }).then(data1 => {
    //     console.log("FCM token...", data1);

    //   })

    //   this.deviceService.getFCMToken().subscribe(result => {
    //     console.log("FCM...", result);
    //   })

    // return from (Plugins.Storage.get({ key: 'FCMToken' })).pipe(
    //   map(storedToken => {

    //       this.pushNotificationService.setDeviceToken(data.uuid, data.model, JSON.stringify(storedToken.value)).subscribe(data => {

    //         this.router.navigateByUrl('/landing-page');
    //         console.log("Device token",JSON.stringify(storedToken.value));
    //       });
    //   })
    // )
    // })
  }
}
