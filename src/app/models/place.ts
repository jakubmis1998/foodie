export interface Place {
  id: string;
  name: string;
  tags: string[];
  rate: {
    localization: number;
    staff: number;
    comfort: number;
    price: number;
    cleanliness: number;
  }; // Out of 10, step: 0.5? External rating from google?
  address: {
    city: string;
    street: string;
    localNumber: string;
  }; // Google maps?
}

// Google maps api, Google places api
