import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleAuthProvider } from '@angular/fire/auth';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserCredential } from '../models/firebaseModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCredential: UserCredential;

  constructor(
    private httpClient: HttpClient,
    private fireAuth: AngularFireAuth,
    private router: Router
  ) {}

  login(): void {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/photoslibrary.readonly');
    provider.setCustomParameters({ prompt: 'select_account' });
    this.fireAuth.signInWithPopup(provider).then((userCredential: firebase.auth.UserCredential) => {
      this.userCredential = userCredential;
      this.router.navigate(['/dashboard']);
      localStorage.setItem('accessToken', (userCredential.credential as firebase.auth.OAuthCredential).accessToken!);
    })
      .catch((error) => {
        console.log(error);
      });
  }

  logout(): void {
    this.fireAuth.signOut().then(() => {
      localStorage.removeItem('accessToken');
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.fireAuth.user).pipe(
      map(user => !!user)
    );
  }

  userChanged(user: User): void {
    this.fireAuth.updateCurrentUser(user).then(() => {});
  }

  getUser(): Observable<User> {
    return from(this.fireAuth.user);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
