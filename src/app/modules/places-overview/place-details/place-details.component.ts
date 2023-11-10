import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { Place } from '../../../models/place';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  options: Highcharts.Options;

  loading = true;
  item: Place;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private firestoreDataService: FirestoreDataService
  ) {
  }

  ngOnInit(): void {
    const placeId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.firestoreDataService.get(placeId).subscribe(place => {
      this.item = place as Place;
      this.setOptions();
      this.loading = false;
    });
  }

  setOptions(): void {
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
      },
      subtitle: {
        text: this.item.name
      },
      xAxis: {
        categories: ['Cleanliness', 'Comfort', 'Localization', 'Prices', 'Staff', 'Average'],
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
          data: [
            this.item.rating.cleanliness,
            this.item.rating.comfort,
            this.item.rating.localization,
            this.item.rating.prices,
            this.item.rating.staff,
            this.item.averageRating
          ]
        }
      ]
    } as Highcharts.Options;
  }

  goBack(): void {
    this.location.back();
  }
}
