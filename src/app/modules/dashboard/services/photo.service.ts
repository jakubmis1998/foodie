import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class PhotoService {

  private readonly BASE_URL = 'https://photoslibrary.googleapis.com/v1';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getPhotos(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/mediaItems`, {
      headers: {'Authorization': `Bearer ${this.authService.getAccessToken()}`}
    });
  }
}
