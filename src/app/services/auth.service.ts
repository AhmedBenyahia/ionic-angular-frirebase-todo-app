import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Observable, Observer, ReplaySubject, Subject} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    token: any;
    currentUser: firebase.User;
    currentUserId: string;

    get user(): ReplaySubject<firebase.User> {
        return this._user;
    }

    private provider: firebase.auth.GoogleAuthProvider;
    private _user: ReplaySubject<firebase.User> = new ReplaySubject<firebase.User>();

    constructor(private angularFireAuth: AngularFireAuth) {
        // fill in auth credentials from local storage
      if (localStorage.getItem('auth')) {
        const result = JSON.parse(localStorage.getItem('auth'));
        const credential = result.credential;
        this.token = credential ? credential.accessToken : null;
        // The signed-in user info.
        this._user.next(result.user);
        this.currentUser = result.user;
        this.currentUserId = result.user.uid;
      }
    }
    // signIn with email and password
    signInUser(value) {
        return new Promise<any>((resolve, reject) => {
            // call firebase login api
            this.angularFireAuth.signInWithEmailAndPassword(value.email, value.password)
                .then(
                    result => {
                        // save auth data in the local storage
                        localStorage.setItem('auth', JSON.stringify(result));
                        const credential = result.credential;
                        // This gives you the Access Token.
                        // @ts-ignore
                        this.token = credential ? credential.accessToken : null;
                        // The signed-in user info.
                        this._user.next(result.user);
                        this.currentUser = result.user;
                        this.currentUserId = result.user.uid;
                        resolve(result);
                    },
                    err => {
                        this._user.error(err);
                        reject(err);
                    });
        });
    }

    // login with google account
    authenticateWithGoogle() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().useDeviceLanguage();
        firebase.auth()
            .signInWithPopup(this.provider)
            .then(async (result) => {
                // save auth data in the local storage
              localStorage.setItem('auth', JSON.stringify(result));
              const credential = result.credential;
              // This gives you a Google Access Token. You can use it to access the Google API.
              // @ts-ignore
              this.token = credential.accessToken;
              // The signed-in user info.
              this._user.next(result.user);
              this.currentUser = result.user;
              this.currentUserId = result.user.uid;
            }).catch((error) => {
                // Handle Errors here.
                this._user.error(error);
        });
    }
}
