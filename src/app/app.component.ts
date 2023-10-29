import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private fireAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fireAuth.authState.subscribe((user: firebase.User | null) => {
      this.authService.userChanged(user);
      console.log("authState changed. Email: ", user);
    });
  }
}
