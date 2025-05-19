export type Brand = { brand_id: number; brand_name: string };
export type Location = { location_id: number; location_name: string };

export type formValues = {
  email: string;
  password: string;
  passwordConfirmation?: string;
};

export interface Car {
  car_id: number;
  brand: string;
  model: string;
  photo: string;
  location: string[];
  seats_available: number;
  price_per_day: number;
}

export interface CarDetailsProps {
  car_id: string;
  model: string;
  price_per_day: number;
  seats_available: number;
  photo: string;
  production_year: number;
  car_description: string;
  brand: string;
  location: string;
}

export interface FilterParams {
  location?: string;
  brand?: string;
  seats?: string;
  price_min?: string;
  price_max?: string;
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
