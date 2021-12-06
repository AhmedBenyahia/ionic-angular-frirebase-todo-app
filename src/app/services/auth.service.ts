import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Observable, Observer, ReplaySubject, Subject} from 'rxjs';

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

    constructor() {
      if (localStorage.getItem('auth')) {
        const result = JSON.parse(localStorage.getItem('auth'));
        const credential = result.credential;
        this.token = credential.accessToken;
        // The signed-in user info.
        this._user.next(result.user);
        this.currentUser = result.user;
        this.currentUserId = result.user.uid;
      }
    }

    authenticateWithGoogle() {
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().useDeviceLanguage();
        firebase.auth()
            .signInWithPopup(this.provider)
            .then(async (result) => {
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
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            this._user.error(error);
        });
    }
}
