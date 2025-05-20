export class ReservationDto {
  reservation_id: string;
  user_id: string;
  car_id: string;
  location_id: string;
  reservation_start_date: Date;
  reservation_end_date: Date;
  reservation_price?: number;
  reservation_status: 'pending' | 'cancelled' | 'confirmed';
}
