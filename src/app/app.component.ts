import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { User } from './models/firebaseModel';
import firebase from "firebase/compat/app";
// Required for side-effects
import 'firebase/compat/firestore';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private fireAuth: AngularFireAuth,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    firebase.initializeApp(environment.firebase);

    this.fireAuth.authState.subscribe((user: User) => {
      this.authService.userChanged(user);
      console.log("authState changed. Email: ", user);
    });
  }
}
