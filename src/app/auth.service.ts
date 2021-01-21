import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
declare var window: any;
import firebase from 'firebase/app'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<any>(this.fireAuth.currentUser);
  constructor(
    private fireAuth: AngularFireAuth
  ) {
    this.init();
  }

  init(): void {
    window.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "1075525420003-393vor4371dr05rlou9890vf8hv8m7p4.apps.googleusercontent.com",
        callback: (token) => {
          this.handle(token);
        }
      });
    };
    this.fireAuth.onAuthStateChanged((user) => {
      console.log('30',user);
      this.user.next(user);
      if (!user) {
        console.log('30',user);
        window.google.accounts.id.prompt();
      }
    });
  }

  handle(token): void {
    const credential = (new (firebase.auth as any).GoogleAuthProvider());
    this.fireAuth.signInWithCredential(credential);
    console.log(this.handle(token));

  }

  signOut(): void {
    this.fireAuth.signOut();
  }
}