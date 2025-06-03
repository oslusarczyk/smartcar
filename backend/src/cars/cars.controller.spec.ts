import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarDto } from './dto/car.dto';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { Readable } from 'stream';

class MockJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
class MockAdminGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('CarsController', () => {
  let controller: CarsController;
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: {
            getCars: jest.fn(),
            getMostPopularCars: jest.fn(),
            getCarById: jest.fn(),
            addCar: jest.fn(),
          },
        },
      ],
    })

      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .overrideGuard(AdminGuard)
      .useClass(MockAdminGuard)
      .compile();

    controller = module.get<CarsController>(CarsController);
    service = module.get<CarsService>(CarsService);
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('getCars', () => {
    it('powinien wywołać carsService.getCars z poprawnymi parametrami', async () => {
      const mockCars: CarDto[] = [];
      jest.spyOn(service, 'getCars').mockResolvedValue(mockCars);

      await controller.getCars('LocationA', 'BrandX', 5, 100, 500);
      expect(service.getCars).toHaveBeenCalledWith(
        'LocationA',
        'BrandX',
        5,
        100,
        500,
      );
    });

    it('powinien zwrócić listę samochodów', async () => {
      const mockCars: CarDto[] = [
        {
          car_id: '1',
          model: 'A',
          photo: 'a',
          price_per_day: 1,
          production_year: 1,
          seats_available: 1,
          car_description: 'a',
        },
      ];
      jest.spyOn(service, 'getCars').mockResolvedValue(mockCars);

      expect(await controller.getCars()).toEqual(mockCars);
    });
  });

  describe('getMostPopularCars', () => {
    it('powinien wywołać carsService.getMostPopularCars', async () => {
      const mockCars: CarDto[] = [];
      jest.spyOn(service, 'getMostPopularCars').mockResolvedValue(mockCars);

      await controller.getMostPopularCars();
      expect(service.getMostPopularCars).toHaveBeenCalled();
    });

    it('powinien zwrócić listę najpopularniejszych samochodów', async () => {
      const mockCars: CarDto[] = [
        {
          car_id: '2',
          model: 'B',
          photo: 'b',
          price_per_day: 2,
          production_year: 2,
          seats_available: 2,
          car_description: 'b',
        },
      ];
      jest.spyOn(service, 'getMostPopularCars').mockResolvedValue(mockCars);

      expect(await controller.getMostPopularCars()).toEqual(mockCars);
    });
  });

  describe('getCarById', () => {
    it('powinien wywołać carsService.getCarById z podanym ID', async () => {
      const mockCar: CarDto = {
        car_id: '3',
        model: 'C',
        photo: 'c',
        price_per_day: 3,
        production_year: 3,
        seats_available: 3,
        car_description: 'c',
      };
      jest.spyOn(service, 'getCarById').mockResolvedValue(mockCar);

      await controller.getCarById('some-id');
      expect(service.getCarById).toHaveBeenCalledWith('some-id');
    });

    it('powinien zwrócić samochód po ID', async () => {
      const mockCar: CarDto = {
        car_id: '4',
        model: 'D',
        photo: 'd',
        price_per_day: 4,
        production_year: 4,
        seats_available: 4,
        car_description: 'd',
      };
      jest.spyOn(service, 'getCarById').mockResolvedValue(mockCar);

      expect(await controller.getCarById('some-id')).toEqual(mockCar);
    });
  });
});
