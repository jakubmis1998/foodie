import { Component, OnInit } from '@angular/core';
import { PhotoService } from './services/photo.service';
import { GooglePhoto } from '../../models/googlePhoto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  photos: GooglePhoto[] = [];

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    // this.photoService.getPhotos().subscribe(photos => {
    //   this.photos = photos;
    // });
  }
}
