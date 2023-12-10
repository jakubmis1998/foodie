import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { GooglePhoto } from '../models/googlePhoto';
import { ObjectType } from '../models/utils';
import { Food } from '../models/food';

@Injectable()
export class GooglePhotosService {

  private readonly BASE_URL = 'https://photoslibrary.googleapis.com/v1';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  create(file: ArrayBuffer, fileName: string): Observable<GooglePhoto> {
    const token = this.authService.getAccessToken();
    return this.httpClient.request('POST', `${this.BASE_URL}/uploads`, {
      body: file,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/octet-stream',
        'X-Goog-Upload-Content-Type': 'image/jpeg',
        'X-Goog-Upload-Protocol': 'raw',
        'X-Goog-Upload-File-Name': fileName
      }
    }).pipe(
      catchError<any, any>((result: ObjectType) => {
        const imageData = {
          'newMediaItems': [
            {
              'simpleMediaItem': {
                'uploadToken': result.error.text
              }
            }
          ]
        };
        return this.httpClient.post(`${this.BASE_URL}/mediaItems:batchCreate`, imageData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          }
        }).pipe(
          map((result: ObjectType) => {
            return result.newMediaItemResults[0].mediaItem as GooglePhoto;
          })
        )
      })
    );
  }

  get(id: string): Observable<GooglePhoto> {
    return this.httpClient.get(`${this.BASE_URL}/mediaItems/${id}`, {
      headers: {'Authorization': `Bearer ${this.authService.getAccessToken()}`}
    }).pipe(
      map(result => result as GooglePhoto)
    );
  }

  getAll(): Observable<GooglePhoto[]> {
    return this.httpClient.get(`${this.BASE_URL}/mediaItems`, {
      headers: {'Authorization': `Bearer ${this.authService.getAccessToken()}`}
    }).pipe(
      map(result => (result as { mediaItems: GooglePhoto[] }).mediaItems)
    );
  }
}
