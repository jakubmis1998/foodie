import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import firebase from 'firebase/compat';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mode: boolean;
  userCredential: firebase.auth.UserCredential | null;
  user: firebase.User | null;

  constructor(public authService: SocialAuthService, private httpClient: HttpClient, private fireAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.mode = environment.production;

    this.fireAuth.authState.subscribe((user: firebase.User | null) => {
      this.user = user;
      console.log("authState changed. Email: ", user?.email);
    });
  }

  firebaseLogin(): void {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/photoslibrary.readonly');
    this.fireAuth.signInWithPopup(provider).then((userCredential: firebase.auth.UserCredential) => {
      this.userCredential = userCredential;
      console.log(444, userCredential);
      console.log('You have been successfully logged in!');
      localStorage.setItem('accessToken', (userCredential.credential as firebase.auth.OAuthCredential).accessToken!);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  logout(): void {
    this.fireAuth.signOut().then(() => {
      console.log("Wylogowano");
      localStorage.removeItem('accessToken');
    });
  }

  getGooglePhotoData(): void {
    this.httpClient.get('https://photoslibrary.googleapis.com/v1/mediaItems', {
      headers: { Authorization: `Bearer ${this.getAccessToken()}` },
    })
    .subscribe((media) => {
      console.log(media);
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
