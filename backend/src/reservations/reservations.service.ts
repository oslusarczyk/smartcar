import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}
  updateReservationStatus(id: string, reservation_status: string) {
    throw new Error('Method not implemented.');
  }
  async addReservation(
    reservation_start_date: string,
    reservation_end_date: string,
    location_id: string,
    car_id: string,
    user_id: string,
  ) {
    try {
      const startDate = new Date(reservation_start_date);
      const endDate = new Date(reservation_end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Zły format daty');
      }

      if (startDate >= endDate) {
        throw new BadRequestException(
          'Data końcowa musi być późniejsza niż początkowa',
        );
      }
      const car = await this.prisma.car.findUnique({
        where: { car_id },
        select: { price_per_day: true },
      });

      const car_price = car?.price_per_day || 0;

      const DAY_DATE = 1000 * 60 * 60 * 24;
      const reservation_days =
        Math.abs(startDate.getTime() - endDate.getTime()) / DAY_DATE;

      return await this.prisma.reservation.create({
        data: {
          reservation_start_date: startDate,
          reservation_end_date: endDate,
          location_id,
          car_id,
          user_id,
          reservation_price: Math.round(car_price * reservation_days),
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P0001') {
        throw new BadRequestException('Invalid data provided to the database');
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  getPendingReservations() {
    throw new Error('Method not implemented.');
  }
  getReservationsByUserId(user_id: string, status: string) {
    throw new Error('Method not implemented.');
  }
}
