import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenStreetService {

  constructor(private httpClient: HttpClient) {}

  search(query: string): Observable<any> {
    // Limit może do ustawienia w User profile view na przyszlosc
    return this.httpClient.get(
      `https://nominatim.openstreetmap.org/search`, {
        params: new HttpParams().set('q', query).set('limit', 5).set('format', 'jsonv2').set('addressdetails', 1).set('extratags', 1)
      }
    );
  }
}
