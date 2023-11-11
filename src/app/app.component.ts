import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { User } from './models/firebaseModel';
import firebase from "firebase/compat/app";
// Required for side-effects
import 'firebase/compat/firestore';
import { environment } from '../environments/environment';
import { LocationService } from './services/location.service';
import { OpenStreetService } from './services/openstreet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private fireAuth: AngularFireAuth,
    private authService: AuthService,
    private locationService: LocationService,
    private osmService: OpenStreetService
  ) {}


  ngOnInit(): void {
    firebase.initializeApp(environment.firebase);

    this.osmService.search("Toruń Manekin").subscribe(
      result => console.log(result)
    )

    this.locationService.init();
    this.fireAuth.authState.subscribe((user: User) => {
      this.authService.userChanged(user);
      console.log("authState changed. Email: ", user);
    });
  }
}
