import { Controller, Get } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarDto } from './dto/car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  @Get('most-popular')
  async getMostPopularCars() {
    return this.carsService.getMostPopularCars();
  }
}
