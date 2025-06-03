import { CarDto } from './car.dto';

describe('CarDto', () => {
  it('powinien być zdefiniowany', () => {
    expect(new CarDto()).toBeDefined();
  });

  it('powinien mieć wszystkie zdefiniowane właściwości', () => {
    const carDto = new CarDto();
    carDto.car_id = 'test-car-id';
    carDto.brand_id = 'test-brand-id';
    carDto.model = 'Test Model';
    carDto.price_per_day = 100;
    carDto.seats_available = 5;
    carDto.photo = 'test.jpg';
    carDto.production_year = 2020;
    carDto.car_description = 'Test Description';
    carDto.brand = 'Test Brand Name';
    carDto.location = ['Test Location'];

    expect(carDto.car_id).toBe('test-car-id');
    expect(carDto.brand_id).toBe('test-brand-id');
    expect(carDto.model).toBe('Test Model');
    expect(carDto.price_per_day).toBe(100);
    expect(carDto.seats_available).toBe(5);
    expect(carDto.photo).toBe('test.jpg');
    expect(carDto.production_year).toBe(2020);
    expect(carDto.car_description).toBe('Test Description');
    expect(carDto.brand).toBe('Test Brand Name');
    expect(carDto.location).toEqual(['Test Location']);
  });
});
