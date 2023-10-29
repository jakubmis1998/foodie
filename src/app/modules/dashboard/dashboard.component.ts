import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from './services/photo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  mode = environment.production;
  photos: any[];

  constructor(private photoService: PhotoService, public authService: AuthService) {}

  ngOnInit(): void {
    this.photoService.getPhotos().subscribe(photos => {
      console.log(photos.mediaItems);
      this.photos = photos.mediaItems;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
