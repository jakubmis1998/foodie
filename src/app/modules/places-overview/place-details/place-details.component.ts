import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Place } from '../../../models/place';
import * as Highcharts from 'highcharts';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { FirestoreFoodDataService } from '../../../services/firestore-data/firestore-food-data.service';
import { forkJoin, map } from 'rxjs';
import { FilterParams, ListParams, PaginationParams, SortingParams } from '../../../models/list-params';
import { Food } from '../../../models/food';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  ratingOptions: Highcharts.Options;
  foodChartOptions: Highcharts.Options;
  foodRatingOptions: Highcharts.Options;
  loading = true;
  place: Place;
  foodOfPlace: Food[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private firestorePlaceDataService: FirestorePlaceDataService,
    private firestoreFoodDataService: FirestoreFoodDataService
  ) {}

  ngOnInit(): void {
    const placeId = this.activatedRoute.snapshot.paramMap.get('id')!;
    forkJoin([
      this.firestorePlaceDataService.get(placeId),
      this.firestoreFoodDataService.getAll(
        undefined, undefined, new ListParams(
          new SortingParams('createdAt'),
          new FilterParams('placeId', placeId),
          new PaginationParams(0)
        )
      ).pipe(
        map(response => response.items)
      )
    ]).subscribe(result => {
      this.place = result[0] as Place;
      this.foodOfPlace = result[1] as Food[];
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
    this.ratingOptions = {
      accessibility: {
        enabled: false
      },
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: this.place.name,
        margin: 25
      },
      xAxis: {
        categories: ['Localization', 'Staff', 'Comfort', 'Prices', 'Design', 'Average'],
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
          name: this.place.name,
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
            this.place.rating.design,
            { y: this.place.averageRating, color: '#816ddb' }
          ]
        }
      ]
    } as Highcharts.Options;

    this.foodChartOptions = {
      accessibility: {
        enabled: false
      },
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Food prices',
        margin: 25
      },
      xAxis: {
        categories: this.foodOfPlace.map(food => `${food.name}<br>(${new DatePipe('en-US').transform(food.createdAt)})`),
        crosshair: true
      },
      yAxis: {
        title: {
          text: 'Total price'
        },
        labels: {
          format: '{text} zł'
        }
      },
      tooltip: {
        valueSuffix: ' zł'
      },
      series: [
        {
          name: 'Food prices',
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'allow',
            format: '{y} zł',
            style: {
              fontSize: '15'
            }
          },
          data: this.foodOfPlace.map(food => food.price)
        }
      ]
    } as Highcharts.Options;

    this.foodRatingOptions = {
      accessibility: {
        enabled: false
      },
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: `Average food (${this.foodOfPlace.length} dishes) rating`,
        margin: 25
      },
      xAxis: {
        categories: ['Taste', 'Look / Design', 'Price', 'Portion size'],
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
          name: 'Average food rating',
          color: 'purple',
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'allow',
            style: {
              fontSize: '15'
            }
          },
          data: [
            this.foodOfPlace.reduce((sum: number, val: Food) => sum + val.rating.taste, 0) / (this.foodOfPlace.length || 1),
            this.foodOfPlace.reduce((sum: number, val: Food) => sum + val.rating.look, 0) / (this.foodOfPlace.length || 1),
            this.foodOfPlace.reduce((sum: number, val: Food) => sum + val.rating.price, 0) / (this.foodOfPlace.length || 1),
            this.foodOfPlace.reduce((sum: number, val: Food) => sum + val.rating.portionSize, 0) / (this.foodOfPlace.length || 1)
          ]
        }
      ]
    } as Highcharts.Options;
  }

  getFoodPriceSum(): number {
    return this.foodOfPlace.map(food => food.price).reduce((sum, val) => sum + val, 0);
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
