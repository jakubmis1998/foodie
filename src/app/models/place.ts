export interface Place {
  id: string;
  name: string;
  tags: string[];
  averageRating: number;
  rating: PlaceRating;
  address: { [ key: string ]: any };
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
