import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController, AlertController, LoadingController, MenuController } from '@ionic/angular';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  form: FormGroup;
  constructor(
    private toastController: ToastController,
    private loginServise: LoginService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private menuCntrl: MenuController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(
        null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(100), Validators.email]
        })
    });
  }

  ionViewWillEnter() {
    this.menuCntrl.enable(false);
  }

  validateUser() {
    if (!this.form.valid) {
      // console.log("Form---");
      // console.log(this.form);
      let errorMsg = "Enter a valid Email.";
      if (!this.form.value.username) {
        errorMsg = "Enter Email.";
      }
      this.presentToast(errorMsg);
      return;
    }

    this.loadingController.create({ keyboardClose: true, message: '' }).then(loadingEl => {
      loadingEl.present();
      this.loginServise.resetPassword(this.form.value.username).subscribe(data => {
        // console.log(data);
        loadingEl.dismiss();
        if (data.RESETPASSWORD) {
          this.showAlert("Success", "Please check your Email.");
        } else {
          this.showAlert("Error", "Email not found.");
        }
      }, error => {
        loadingEl.dismiss();
        this.showAlert("Error", "Something went wrong.")
      })

    })

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  showAlert(heading: string, message: string) {
    this.alertCtrl
      .create({
        header: heading,
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  goBack() {
    this.router.navigateByUrl('/entry');
  }

}
