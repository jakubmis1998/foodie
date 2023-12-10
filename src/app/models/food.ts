import { BaseModel } from './base-model';
import { Constant } from './constant';

export interface Food extends BaseModel {
  name: string;
  type: Constant;
  averageRating: number;
  rating: FoodRating;
  thumbnailUrl: string;
  placeId: string;
  price: number;
}

export interface FoodRating {
  taste: number;
  look: number;
  price: number;
  portionSize: number;
}
