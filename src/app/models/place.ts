import { ObjectType } from './utils';
import { BaseModel } from './base-model';
import { Constant } from './constant';

export interface Place extends BaseModel {
  name: string;
  type: Constant;
  averageRating: number;
  rating: PlaceRating;
  address: ObjectType;
}

export interface PlaceRating {
  localization: number;
  staff: number;
  comfort: number;
  prices: number;
  cleanliness: number;
}
