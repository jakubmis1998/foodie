import { Injectable } from '@angular/core';
import * as haversine from 'haversine-distance';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  currentLocation: GeolocationCoordinates;

  getDistance(point: { latitude: number; longitude: number }): number {
    const currentPosition = this.getCurrentLocation();
    return haversine({ latitude: currentPosition.latitude, longitude: currentPosition.longitude }, point as any) / 1000;
  }

  getCurrentLocation(): GeolocationCoordinates {
    if (!this.currentLocation) {
      this.updateCurrentLocation();
    }
    return this.currentLocation;
  }

  updateCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => this.currentLocation = position.coords,
        error => alert(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
