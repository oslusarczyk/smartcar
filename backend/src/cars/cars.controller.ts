import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarDto } from './dto/car.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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

  @Get(':id')
  async getCarById(@Param('id') id: string): Promise<CarDto> {
    return this.carsService.getCarById(id);
  }

  @Post('upload')
  // @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('car_photo', {
      storage: diskStorage({
        destination: path.join(__dirname, '../uploads'),
        filename: (req, file, cb) => {
          const filename = `Math.random() * 1e9`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
          return cb(new Error('Nie wspierany rodzaj pliku'), false);
        }
        cb(null, true);
      },
    }),
  )
  addCar(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // return this.carsService.addCar();
  }
}
