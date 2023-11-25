import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Food } from '../../../models/food';
import { FirestoreFoodDataService } from '../../../services/firestore-data/firestore-food-data.service';
import { map, of, switchMap, zip } from 'rxjs';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { Place } from '../../../models/place';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.scss']
})
export class FoodDetailsComponent {

  loading = true;
  food: Food;
  place: Place;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private firestoreFoodDataService: FirestoreFoodDataService,
    private firestorePlaceDataService: FirestorePlaceDataService
  ) {
  }

  ngOnInit(): void {
    const foodId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.firestoreFoodDataService.get(foodId).pipe(
      map(food => food as Food),
      switchMap((food: Food) => {
        return zip(of(food), this.firestorePlaceDataService.get(food.placeId))
      })
    ).subscribe(result => {
      this.food = result[0] as Food;
      this.place = result[1] as Place;
      this.loading = false;
    });
  }

  format(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ')
  }

  goBack(): void {
    this.location.back();
  }
}
