import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CarDto } from './dto/car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMostPopularCars(): Promise<CarDto[]> {
    const cars = await this.prisma.car.findMany({
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
    return cars.map((car) => ({
      car_id: car.car_id,
      model: car.model,
      price_per_day: car.price_per_day,
      seats_available: car.seats_available,
      photo: car.photo,
      production_year: car.production_year,
      car_description: car.car_description,
      brand: car.brand.brand_name,
      location: car.cars_locations.map(
        (carLocation) => carLocation.location.location_name,
      ),
    }));
  }

  async getCars(
    location?: string,
    brand?: string,
    seats?: number,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<CarDto[]> {
    const cars = await this.prisma.car.findMany({
      where: {
        ...(brand && {
          brand: {
            brand_name: brand,
          },
        }),
        ...(seats && { seats_available: seats }),
        ...(location && {
          cars_locations: {
            some: {
              location: {
                location_name: location,
              },
            },
          },
        }),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              price_per_day: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
              },
            }
          : {}),
      },
      include: {
        brand: true,
        cars_locations: {
          include: {
            location: true,
          },
        },
      },
    });

    return cars.map((car) => ({
      car_id: car.car_id,
      model: car.model,
      price_per_day: car.price_per_day,
      seats_available: car.seats_available,
      photo: car.photo,
      production_year: car.production_year,
      car_description: car.car_description,
      brand: car.brand.brand_name,
      location: car.cars_locations.map(
        (carLocation) => carLocation.location.location_name,
      ),
    }));
  }

  async getCarById(id: string): Promise<CarDto> {
    const car = await this.prisma.car.findUnique({
      where: { car_id: id },
      include: {
        cars_locations: {
          include: {
            location: true,
          },
        },
        brand: true,
      },
    });

    if (!car) {
      throw new NotFoundException(`nie znaleziono samochodu z takim ${id}`);
    }

    const result: CarDto = {
      car_id: car.car_id,
      model: car.model,
      price_per_day: car.price_per_day,
      seats_available: car.seats_available,
      photo: car.photo,
      production_year: car.production_year,
      car_description: car.car_description,
      brand: car.brand.brand_name,
      location: car.cars_locations.map(
        (carLocation) => carLocation.location.location_name,
      ),
    };

    return result;
  }

  async addCar(
    carDto: CarDto,
    locations_id: string[],
    file?: Express.Multer.File,
  ): Promise<CarDto> {
    let filePath = '';

    if (file) {
      filePath = `${file.filename}`;
    }

    if (!carDto.brand_id) {
      throw new Error('brand_id jest wymagane');
    }
    const newCar = await this.prisma.car.create({
      data: {
        brand_id: carDto.brand_id,
        model: carDto.model,
        price_per_day: Number(carDto.price_per_day),
        seats_available: Number(carDto.seats_available),
        photo: filePath,
        production_year: Number(carDto.production_year),
        car_description: carDto.car_description,
        cars_locations: {
          create: locations_id.map((locId) => ({
            location_id: locId,
          })),
        },
      },
    });

    return {
      car_id: newCar.car_id,
      model: newCar.model,
      price_per_day: newCar.price_per_day,
      seats_available: newCar.seats_available,
      photo: newCar.photo,
      production_year: newCar.production_year,
      car_description: newCar.car_description,
    };
  }
}
