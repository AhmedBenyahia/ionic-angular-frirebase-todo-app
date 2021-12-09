import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;

  constructor(
      private _authService: AuthService,
      private router: Router,
      private fb: FormBuilder,
      private alertController: AlertController,
      private loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    if (this._authService.currentUser) {
      this.router.navigate(['/login']);
    }
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this._authService.signInUser(this.credentials.value)
        .then(async(result) => {
          await loading.dismiss();
          this.router.navigateByUrl('/home', { replaceUrl: true });

        }, async(err) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            message: err.message ,
            buttons: ['OK'],
          });

          await alert.present();
         });
  }
  async loginWithGoogle() {
    this._authService.authenticateWithGoogle();
    this._authService.user.subscribe(value => {
      this.router.navigate(['/home']);
    });
  }
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

}
