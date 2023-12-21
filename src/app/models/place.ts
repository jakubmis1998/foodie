import { ObjectType } from './utils';
import { BaseModel } from './base-model';

export interface Place extends BaseModel {
  name: string;
  types: string[];
  averageRating: number;
  rating: PlaceRating;
  address: ObjectType;
}

export interface PlaceRating {
  localization: number;
  staff: number;
  comfort: number;
  prices: number;
  design: number;
}
