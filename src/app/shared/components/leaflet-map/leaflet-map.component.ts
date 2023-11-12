import { Component, Input, OnInit } from '@angular/core';
import { circle, Icon, icon, IconOptions, latLng, marker, Point, tileLayer } from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { ObjectType } from '../../../models/utils';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {

  @Input() coords;

  options: ObjectType;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locationService.updateCurrentLocation().subscribe(currentPos => {
      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
          circle(latLng(this.coords.lat, this.coords.lon), { radius: 5, color: 'purple' }),
          marker(latLng(this.coords.lat, this.coords.lon), {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconAnchor: new Point(currentPos.latitude - 28, currentPos.longitude + 22),
              iconSize: [50, 50],
              iconUrl: 'assets/markers/purple-marker.svg',
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
              shadowUrl: undefined
            } as IconOptions)
          })
        ],
        zoom: 18,
        maxZoom: 18,
        center: latLng(this.coords.lat, this.coords.lon)
      };
    });
  }
}
