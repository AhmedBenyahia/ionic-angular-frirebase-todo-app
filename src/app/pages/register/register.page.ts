import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

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
    // if user already connect redirect to home page
    if (this._authService.currentUser) {
      this.router.navigate(['/home']);
    }
    // create form validation
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [ Validators.required, this._authService.matchValues('password')]]
    });
  }
  // register with email and password
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    this._authService.signUpUser(this.credentials.value)
        .then(async(result) => {
          await loading.dismiss();
          this.router.navigateByUrl('/login', { replaceUrl: true });

        }, async(err) => {
          await loading.dismiss();
          // handle errors in simple alert
          const alert = await this.alertController.create({
            header: 'Register failed',
            message: err.message ,
            buttons: ['OK'],
          });

          await alert.present();
        });
  }

  // login with google
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

  get passwordConfirm() {
    return this.credentials.get('passwordConfirm');
  }
}
