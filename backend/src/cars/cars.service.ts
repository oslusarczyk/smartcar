import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
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
}
