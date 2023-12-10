import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Place } from '../../../models/place';
import * as Highcharts from 'highcharts';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  options: Highcharts.Options;
  loading = true;
  place: Place;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private firestorePlaceDataService: FirestorePlaceDataService
  ) {
  }

  ngOnInit(): void {
    const placeId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.firestorePlaceDataService.get(placeId).subscribe(place => {
      this.place = place as Place;
      this.setChartOptions();
      this.loading = false;
    });
  }

  getExtras(field = 'extratags'): [string, unknown][] {
    return Object.entries(this.place?.address?.[field]).map(entry => {
      entry[0] = this.format(entry[0]);
      return entry;
    });
  }

  setChartOptions(): void {
    this.options = {
      accessibility: {
        enabled: false
      },
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Rating',
        margin: 25
      },
      xAxis: {
        categories: ['Localization', 'Staff', 'Comfort', 'Prices', 'Cleanliness', 'Average'],
        crosshair: true
      },
      yAxis: {
        max: 5
      },
      tooltip: {
        valueSuffix: ' / 5'
      },
      series: [
        {
          name: 'Rating',
          color: 'orange',
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'allow',
            style: {
              fontSize: '15'
            }
          },
          data: [
            this.place.rating.localization,
            this.place.rating.staff,
            this.place.rating.comfort,
            this.place.rating.prices,
            this.place.rating.cleanliness,
            { y: this.place.averageRating, color: '#816ddb' }
          ]
        }
      ]
    } as Highcharts.Options;
  }

  format(str: string): string {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replaceAll('_', ' ');
    }
    return '-';
  }

  goBack(): void {
    this.location.back();
  }
}
