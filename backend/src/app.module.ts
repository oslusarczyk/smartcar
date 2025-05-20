import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { LocationsModule } from './locations/locations.module';
import { CarsModule } from './cars/cars.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, BrandsModule, LocationsModule, CarsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
