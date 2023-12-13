import { BaseModel } from './base-model';

export interface Food extends BaseModel {
  name: string;
  characteristics: string[];
  averageRating: number;
  rating: FoodRating;
  photoId: string;
  placeId: string;
  price: number;
}

export interface FoodRating {
  taste: number;
  look: number;
  price: number;
  portionSize: number;
}
