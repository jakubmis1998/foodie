export interface Place {
  id: string;
  name: string;
  tags: string[];
  averageRating: number;
  rating: PlaceRating; // Out of 10, step: 0.5? External rating from google?
  address: PlaceAddress; // Google maps?
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

export interface PlaceAddress {
  city: string;
  street: string;
  streetNumber: number;
}

// Google maps api, Google places api
