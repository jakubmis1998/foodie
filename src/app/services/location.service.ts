import { Injectable } from '@angular/core';
import * as haversine from 'haversine-distance';
import { from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  currentLocation: GeolocationCoordinates;

  getDistance(point: { latitude: number; longitude: number }): Observable<number> {
    return this.getCurrentLocation().pipe(
      map((pos: GeolocationCoordinates) => haversine({ latitude: pos.latitude, longitude: pos.longitude }, point) / 1000)
    );
  }

  getCurrentLocation(): Observable<GeolocationCoordinates> {
    if (!this.currentLocation) {
      return this.updateCurrentLocation();
    }
    return of(this.currentLocation);
  }

  updateCurrentLocation(): Observable<GeolocationCoordinates> {
    return from(new Promise<GeolocationCoordinates>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              this.currentLocation = position.coords;
              resolve(position.coords);
            } else {
              alert('No position detected.');
            }
          },
          (error) => {
            alert(`Geolocation error: ${error}`);
            console.log(error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        reject('Geolocation is not supported by this browser.');
      }
    }));
  }
}
