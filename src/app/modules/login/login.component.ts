import { Component } from '@angular/core';
import firebase from 'firebase/compat';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  userCredential: firebase.auth.UserCredential | null;
  user: firebase.User | null;

  constructor(
    private httpClient: HttpClient, private authService: AuthService
  ) {}

  firebaseLogin(): void {
    this.authService.login();
  }
}
