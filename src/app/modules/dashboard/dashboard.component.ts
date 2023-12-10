import { Component, OnInit } from '@angular/core';
import { GooglePhotosService } from '../../services/google-photos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private googlePhotosService: GooglePhotosService) {
  }

  ngOnInit(): void {
    this.googlePhotosService.getAll().subscribe(e => console.log(e));
  }
}
