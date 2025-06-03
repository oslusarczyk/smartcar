import { ReservationDto } from './reservation.dto';

describe('ReservationDto', () => {
  it('powinien być zdefiniowany', () => {
    expect(new ReservationDto()).toBeDefined();
  });

  it('powinien mieć wszystkie zdefiniowane właściwości', () => {
    const reservationDto = new ReservationDto();
    reservationDto.reservation_id = 'res-123';
    reservationDto.user_id = 'user-abc';
    reservationDto.car_id = 'car-xyz';
    reservationDto.location_id = 'loc-def';
    reservationDto.reservation_start_date = new Date('2024-01-01');
    reservationDto.reservation_end_date = new Date('2024-01-05');
    reservationDto.reservation_price = 500;
    reservationDto.reservation_status = 'pending';

    expect(reservationDto.reservation_id).toBe('res-123');
    expect(reservationDto.user_id).toBe('user-abc');
    expect(reservationDto.car_id).toBe('car-xyz');
    expect(reservationDto.location_id).toBe('loc-def');
    expect(reservationDto.reservation_start_date).toEqual(
      new Date('2024-01-01'),
    );
    expect(reservationDto.reservation_end_date).toEqual(new Date('2024-01-05'));
    expect(reservationDto.reservation_price).toBe(500);
    expect(reservationDto.reservation_status).toBe('pending');
  });
});
