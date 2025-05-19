export class CarDto {
  car_id: string;
  brand_id?: string;
  model: string;
  price_per_day: number;
  seats_available: number;
  photo: string;
  production_year: number;
  car_description: string;
  brand?: string;
  location?: string[];
}
