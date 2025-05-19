import { Controller, Get, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarDto } from './dto/car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getCars(
    @Query('location') location?: string,
    @Query('brand') brand?: string,
    @Query('seats') seats?: number,
    @Query('price_min') minPrice?: number,
    @Query('price_max') maxPrice?: number,
  ): Promise<CarDto[]> {
    const parsedSeats = seats ? Number(seats) : undefined;
    const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
    const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;
    return this.carsService.getCars(
      location,
      brand,
      parsedSeats,
      parsedMinPrice,
      parsedMaxPrice,
    );
  }

  @Get('most-popular')
  async getMostPopularCars() {
    return this.carsService.getMostPopularCars();
  }
}
