import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import firebase from 'firebase';
import {AuthService} from '../services/auth.service';
import {Route, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    credentials: FormGroup;

    constructor(private _authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this._authService.user.subscribe(value => {
            this.router.navigate(['/home']);
        });
    }

    loginWithGoogle() {
        this._authService.authenticateWithGoogle();
        this._authService.user.subscribe(value => {
            this.router.navigate(['/home']);
        });
    }
}
