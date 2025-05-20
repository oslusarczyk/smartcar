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

export interface Reservation {
  reservation_id: string;
  user_id: string;
  car_id: string;
  location_id: string;
  reservation_start_date: string;
  reservation_end_date: string;
  reservation_price: number;
  reservation_status: string;
  car: {
    car_id: string;
    brand_id: string;
    model: string;
    price_per_day: number;
    seats_available: number;
    photo: string;
    production_year: number;
    car_description: string;
    brand: {
      brand_id: string;
      brand_name: string;
    };
  };
  location: {
    location_id: string;
    location_name: string;
  };
  user: {
    email: string;
  };
}

export type ReservationFormData = {
  reservationStartDate: string;
  reservationEndDate: string;
  selectedLocation: string;
};

export type ReservationPayload = {
  reservation_start_date: string;
  reservation_end_date: string;
  location_id: string;
  car_id: string;
  user_id: string;
};

export type Status = 'pending' | 'cancelled' | 'confirmed';

export interface User {
  id: string;
  email: string;
  has_admin_privileges: boolean;
}
