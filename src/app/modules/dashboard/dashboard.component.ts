import { Component, OnInit } from '@angular/core';
import { FirestorePlaceDataService } from '../../services/firestore-data/firestore-place-data.service';
import { FirestoreFoodDataService } from '../../services/firestore-data/firestore-food-data.service';
import { forkJoin } from 'rxjs';
import { Food } from '../../models/food';
import { Place } from '../../models/place';
import {
  FilterParams,
  ListParams,
  ListResponse,
  PaginationParams,
  SortDirection,
  SortingParams
} from '../../models/list-params';
import * as Highcharts from 'highcharts';
import { groupBy } from '../../shared/utils/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  pricePerPlaceOptions: Highcharts.Options;
  food: Food[];
  places: Place[];
  totalSpendMoney = 0;
  lastAddedPlace: Place | undefined;
  lastAddedFood: Food | undefined;

  constructor(
    private firestorePlaceDataService: FirestorePlaceDataService,
    private firestoreFoodDataService: FirestoreFoodDataService
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.firestoreFoodDataService.getAll(
        undefined, false, new ListParams(new SortingParams('createdAt', SortDirection.ASC), new FilterParams(), new PaginationParams(0))
      ),
      this.firestorePlaceDataService.getAll(
        undefined, false, new ListParams(new SortingParams('createdAt', SortDirection.ASC), new FilterParams(), new PaginationParams(0))
      )
    ]).subscribe(
      (data: [ListResponse, ListResponse]) => {
        this.food = data[0].items as Food[];
        this.places = data[1].items as Place[];
        this.lastAddedPlace = this.places.length > 0 ? this.places[0] : undefined;
        this.lastAddedFood = this.food.length > 0 ? this.food[0] : undefined;
        this.totalSpendMoney = this.food.reduce((sum: number, val: Food) => sum + val.price, 0);
        this.getOptions();
      }
    );
  }

  getOptions(): void {
    const data = this.pricePerPlaceData();
    this.pricePerPlaceOptions = {
      accessibility: {
        enabled: false
      },
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Total price per place (including dishes count)',
        margin: 25
      },
      yAxis: {
        title: {
          text: 'Total price'
        },
        labels: {
          format: '{text} zł'
        }
      },
      xAxis: {
        categories: data.map(item => item[0]),
        crosshair: true
      },
      tooltip: {
        valueSuffix: ' zł'
      },
      series: [
        {
          name: 'Total price',
          color: '#816ddb',
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'allow',
            format: '{y:,.2f} zł',
            style: {
              fontSize: '15'
            }
          },
          data
        }
      ]
    } as Highcharts.Options;
  }

  pricePerPlaceData(): [string, number][] {
    const grouped = groupBy(this.food, (food: Food) => food.placeId);

    const pricesPerPlace: [string, number][] = [];
    this.places.forEach(place => {
      const foodOfPlace = grouped.get(place.id) as Food[] || [];
      if (foodOfPlace.length) {
        pricesPerPlace.push([`${place.name} (${foodOfPlace.length})`, foodOfPlace.reduce((sum: number, val: Food) => sum + val.price, 0)]);
      } else {
        pricesPerPlace.push([`${place.name} (0)`, 0]);
      }
    });

    return pricesPerPlace.sort((a, b) => a[1] - b[1]);
  }
}
