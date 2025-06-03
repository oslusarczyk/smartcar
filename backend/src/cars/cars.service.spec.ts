import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CarDto } from './dto/car.dto';
import { NotFoundException } from '@nestjs/common';
import { Readable } from 'stream';

describe('CarsService', () => {
  let service: CarsService;
  let prismaService: PrismaService;

  const mockCarData = {
    car_id: 'car-1',
    model: 'Model X',
    price_per_day: 100,
    seats_available: 5,
    photo: 'photo1.jpg',
    production_year: 2020,
    car_description: 'Description for X',
    brand: { brand_name: 'Brand A' },
    cars_locations: [{ location: { location_name: 'Location 1' } }],
    _count: { reservations: 10 },
    brand_id: 'brand-a-id',
  };

  const expectedCarDto: CarDto = {
    car_id: 'car-1',
    model: 'Model X',
    price_per_day: 100,
    seats_available: 5,
    photo: 'photo1.jpg',
    production_year: 2020,
    car_description: 'Description for X',
    brand: 'Brand A',
    location: ['Location 1'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: PrismaService,
          useValue: {
            car: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('getMostPopularCars', () => {
    it('powinien zwrócić listę najpopularniejszych samochodów', async () => {
      jest
        .spyOn(prismaService.car, 'findMany')
        .mockResolvedValue([mockCarData as any]);

      const result = await service.getMostPopularCars();
      expect(prismaService.car.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { reservations: true },
          },
          cars_locations: {
            include: {
              location: true,
            },
          },
          brand: true,
        },
        orderBy: {
          reservations: {
            _count: 'desc',
          },
        },
        take: 3,
      });
      expect(result).toEqual([expectedCarDto]);
    });

    it('powinien zwrócić pustą tablicę, jeśli brak samochodów', async () => {
      jest.spyOn(prismaService.car, 'findMany').mockResolvedValue([]);

      const result = await service.getMostPopularCars();
      expect(result).toEqual([]);
    });
  });

  describe('getCars', () => {
    it('powinien zwrócić listę samochodów z filtrami', async () => {
      jest
        .spyOn(prismaService.car, 'findMany')
        .mockResolvedValue([mockCarData as any]);

      const result = await service.getCars('Location 1', 'Brand A', 5, 50, 150);
      expect(prismaService.car.findMany).toHaveBeenCalledWith({
        where: {
          brand: { brand_name: 'Brand A' },
          seats_available: 5,
          cars_locations: {
            some: { location: { location_name: 'Location 1' } },
          },
          price_per_day: { gte: 50, lte: 150 },
        },
        include: {
          brand: true,
          cars_locations: { include: { location: true } },
        },
      });
      expect(result).toEqual([expectedCarDto]);
    });

    it('powinien zwrócić wszystkie samochody, jeśli brak filtrów', async () => {
      jest
        .spyOn(prismaService.car, 'findMany')
        .mockResolvedValue([mockCarData as any]);

      const result = await service.getCars();
      expect(prismaService.car.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          brand: true,
          cars_locations: { include: { location: true } },
        },
      });
      expect(result).toEqual([expectedCarDto]);
    });
  });

  describe('getCarById', () => {
    it('powinien zwrócić samochód po ID', async () => {
      jest
        .spyOn(prismaService.car, 'findUnique')
        .mockResolvedValue(mockCarData as any);

      const result = await service.getCarById('car-1');
      expect(prismaService.car.findUnique).toHaveBeenCalledWith({
        where: { car_id: 'car-1' },
        include: {
          cars_locations: { include: { location: true } },
          brand: true,
        },
      });
      expect(result).toEqual(expectedCarDto);
    });

    it('powinien rzucić NotFoundException, jeśli samochód nie istnieje', async () => {
      jest.spyOn(prismaService.car, 'findUnique').mockResolvedValue(null);

      await expect(service.getCarById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getCarById('non-existent-id')).rejects.toThrow(
        'nie znaleziono samochodu z takim non-existent-id',
      );
    });
  });

  describe('addCar', () => {
    const mockCarDtoToAdd: CarDto = {
      car_id: 'temp-id',
      brand_id: 'brand-new-id',
      model: 'New Car Model',
      price_per_day: 200,
      seats_available: 4,
      photo: '',
      production_year: 2023,
      car_description: 'Brand new car',
    };
    const mockLocations = ['loc-a', 'loc-b'];
    const mockFile: Express.Multer.File = {
      fieldname: 'car_photo',
      originalname: 'new-car.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '',
      filename: 'generated-filename.jpg',
      path: '',
      buffer: Buffer.from(''),
      stream: new Readable({
        read() {
          this.push(null);
        },
      }),
    };

    it('powinien dodać nowy samochód z plikiem', async () => {
      jest.spyOn(prismaService.car, 'create').mockResolvedValue({
        ...mockCarDtoToAdd,
        car_id: 'new-car-id',
        photo: mockFile.filename,
      } as any);

      const result = await service.addCar(
        mockCarDtoToAdd,
        mockLocations,
        mockFile,
      );

      expect(prismaService.car.create).toHaveBeenCalledWith({
        data: {
          brand_id: mockCarDtoToAdd.brand_id,
          model: mockCarDtoToAdd.model,
          price_per_day: mockCarDtoToAdd.price_per_day,
          seats_available: mockCarDtoToAdd.seats_available,
          photo: mockFile.filename,
          production_year: mockCarDtoToAdd.production_year,
          car_description: mockCarDtoToAdd.car_description,
          cars_locations: {
            create: [{ location_id: 'loc-a' }, { location_id: 'loc-b' }],
          },
        },
      });
      expect(result).toEqual({
        car_id: 'new-car-id',
        model: mockCarDtoToAdd.model,
        price_per_day: mockCarDtoToAdd.price_per_day,
        seats_available: mockCarDtoToAdd.seats_available,
        photo: mockFile.filename,
        production_year: mockCarDtoToAdd.production_year,
        car_description: mockCarDtoToAdd.car_description,
      });
    });

    it('powinien dodać nowy samochód bez pliku', async () => {
      const carDtoWithoutPhoto = { ...mockCarDtoToAdd, photo: '' };
      jest.spyOn(prismaService.car, 'create').mockResolvedValue({
        ...carDtoWithoutPhoto,
        car_id: 'new-car-id-no-photo',
      } as any);

      const result = await service.addCar(
        carDtoWithoutPhoto,
        mockLocations,
        undefined,
      );

      expect(prismaService.car.create).toHaveBeenCalledWith({
        data: {
          brand_id: carDtoWithoutPhoto.brand_id,
          model: carDtoWithoutPhoto.model,
          price_per_day: carDtoWithoutPhoto.price_per_day,
          seats_available: carDtoWithoutPhoto.seats_available,
          photo: '',
          production_year: carDtoWithoutPhoto.production_year,
          car_description: carDtoWithoutPhoto.car_description,
          cars_locations: {
            create: [{ location_id: 'loc-a' }, { location_id: 'loc-b' }],
          },
        },
      });
      expect(result.photo).toBe('');
    });

    it('powinien rzucić błąd, jeśli brand_id jest brakujące', async () => {
      const carDtoWithoutBrandId = { ...mockCarDtoToAdd, brand_id: undefined };
      await expect(
        service.addCar(carDtoWithoutBrandId, mockLocations, mockFile),
      ).rejects.toThrow('brand_id jest wymagane');
    });
  });
});
