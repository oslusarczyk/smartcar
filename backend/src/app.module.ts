import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { LocationsModule } from './locations/locations.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, BrandsModule, LocationsModule, CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
