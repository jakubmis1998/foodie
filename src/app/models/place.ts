import { ObjectType } from './utils';

export interface Place {
  id: string;
  name: string;
  tags: string[];
  averageRating: number;
  rating: PlaceRating;
  address: ObjectType;
  createdAt: Date;
  changedAt: Date;
}

export interface PlaceRating {
  localization: number;
  staff: number;
  comfort: number;
  prices: number;
  cleanliness: number;
}
