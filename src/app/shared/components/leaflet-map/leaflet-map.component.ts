import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { circle, Icon, icon, IconOptions, latLng, marker, Point, tileLayer, Routing, Map, LatLng } from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { ObjectType } from '../../../models/utils';
import 'leaflet-routing-machine';
import { Observable, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {

  @Input() coords;

  options: ObjectType;
  currentPos: GeolocationCoordinates;
  hideRoutingAgenda = true;
  map: Map;
  zoomValue = 17;
  distance: number;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.updateCurrentLocation().subscribe(currentPos => {
      this.currentPos = currentPos;
      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }),
          circle(latLng(this.coords.lat, this.coords.lon), { radius: 5, color: 'purple' }),
          marker(latLng(this.coords.lat, this.coords.lon), {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconAnchor: new Point(currentPos.latitude - 28, currentPos.longitude + 22),
              iconSize: [50, 50],
              iconUrl: 'assets/markers/purple-marker.svg',
              iconRetinaUrl: 'assets/markers/purple-marker.svg',
              shadowUrl: undefined
            } as IconOptions)
          }),
          circle(latLng(currentPos.latitude, currentPos.longitude), { radius: 5, color: 'red' }),
          marker(latLng(currentPos.latitude, currentPos.longitude), {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconAnchor: new Point(currentPos.latitude - 28, currentPos.longitude + 22),
              iconSize: [50, 50],
              iconUrl: 'assets/markers/red-marker.svg',
              shadowUrl: undefined,
              iconRetinaUrl: 'assets/markers/red-marker.svg'
            } as IconOptions)
          })
        ],
        zoom: this.zoomValue,
        minZoom: 4,
        maxZoom: 20,
        center: latLng(this.coords.lat, this.coords.lon)
      };
    });
  }

  zoom(zoom = this.zoomValue, center: LatLng): void {
    this.map.setView(center).setZoom(zoom);
  }

  zoomDestination(): void {
    this.zoom(this.zoomValue, latLng(this.coords.lat, this.coords.lon));
  }

  zoomMe(): void {
    this.zoom(this.zoomValue, latLng(this.currentPos.latitude, this.currentPos.longitude));
  }

  onMapReady(map: Map) {
    this.map = map;
    const waypoints = [latLng(this.currentPos.latitude, this.currentPos.longitude), latLng(this.coords.lat, this.coords.lon)];
    Routing.control({
      waypoints,
      plan: new Routing.Plan(waypoints, {
        createMarker: () => false
      }),
      useZoomParameter: true,
      lineOptions: {styles: [{color: '#00750e'}], extendToWaypoints: false, missingRouteTolerance: 0}
    }).addTo(map);

    setTimeout(() => {
      this.distance = this.map.distance(
        latLng(this.currentPos.latitude, this.currentPos.longitude), latLng(this.coords.lat, this.coords.lon)
      ) / 1000;
    });
  }
}
