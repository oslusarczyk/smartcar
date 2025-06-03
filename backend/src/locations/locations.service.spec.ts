import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '@/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

describe('LocationsService', () => {
  let service: LocationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: {
            location: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('getAllLocations', () => {
    it('powinien zwrócić listę wszystkich lokalizacji', async () => {
      const mockLocations = [
        { id: 1, location_id: 'loc1', location_name: 'Location Alpha' },
        { id: 2, location_id: 'loc2', location_name: 'Location Beta' },
      ];
      jest
        .spyOn(prismaService.location, 'findMany')
        .mockResolvedValue(mockLocations as any);

      const result = await service.getAllLocations();
      expect(prismaService.location.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockLocations);
    });

    it('powinien zwrócić pustą tablicę, jeśli brak lokalizacji', async () => {
      jest.spyOn(prismaService.location, 'findMany').mockResolvedValue([]);

      const result = await service.getAllLocations();
      expect(result).toEqual([]);
    });
  });

  describe('getLocationsByCar', () => {
    it('powinien zwrócić lokalizacje przypisane do danego samochodu', async () => {
      const carId = 'test-car-id';
      const mockLocations = [
        { id: 1, location_id: 'loc1', location_name: 'Location Alpha' },
      ];
      jest
        .spyOn(prismaService.location, 'findMany')
        .mockResolvedValue(mockLocations as any);

      const result = await service.getLocationsByCar(carId);
      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          cars_locations: {
            some: {
              car_id: carId,
            },
          },
        },
      });
      expect(result).toEqual(mockLocations);
    });

    it('powinien zwrócić pustą tablicę, jeśli samochód nie ma przypisanych lokalizacji', async () => {
      const carId = 'car-without-locations';
      jest.spyOn(prismaService.location, 'findMany').mockResolvedValue([]);

      const result = await service.getLocationsByCar(carId);
      expect(result).toEqual([]);
    });
  });
});
