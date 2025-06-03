import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationDto } from './dto/location.dto';

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: {
            getAllLocations: jest.fn(),
            getLocationsByCar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllLocations', () => {
    it('powinien wywołać locationsService.getAllLocations', async () => {
      const mockLocations: LocationDto[] = [];
      jest.spyOn(service, 'getAllLocations').mockResolvedValue(mockLocations);

      await controller.getAllLocations();
      expect(service.getAllLocations).toHaveBeenCalled();
    });

    it('powinien zwrócić listę lokalizacji', async () => {
      const mockLocations: LocationDto[] = [
        { location_id: '1', location_name: 'Location A' },
      ];
      jest.spyOn(service, 'getAllLocations').mockResolvedValue(mockLocations);

      expect(await controller.getAllLocations()).toEqual(mockLocations);
    });
  });

  describe('getLocationsByCar', () => {
    it('powinien wywołać locationsService.getLocationsByCar z podanym ID', async () => {
      const mockLocations: LocationDto[] = [];
      jest.spyOn(service, 'getLocationsByCar').mockResolvedValue(mockLocations);

      await controller.getLocationsByCar('car-id-test');
      expect(service.getLocationsByCar).toHaveBeenCalledWith('car-id-test');
    });

    it('powinien zwrócić listę lokalizacji dla danego samochodu', async () => {
      const mockLocations: LocationDto[] = [
        { location_id: '2', location_name: 'Location B' },
      ];
      jest.spyOn(service, 'getLocationsByCar').mockResolvedValue(mockLocations);

      expect(await controller.getLocationsByCar('car-id-test')).toEqual(
        mockLocations,
      );
    });
  });
});
