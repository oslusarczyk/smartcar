import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Payment, Reservation, ReservationStatus } from '@prisma/client';
@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async addReservation(
    reservation_start_date: string,
    reservation_end_date: string,
    location_id: string,
    car_id: string,
    user_id: string,
  ): Promise<{ reservation: Reservation; payment: Payment }> {
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
    const reservation_price = Math.round(car_price * reservation_days);

    const result = await this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: {
          reservation_start_date: startDate,
          reservation_end_date: endDate,
          location_id,
          car_id,
          user_id,
          reservation_price: reservation_price,
        },
      });

      const payment = await tx.payment.create({
        data: {
          reservation_id: reservation.reservation_id,
          amount: reservation_price,
        },
      });

      return { reservation, payment };
    });
    return result;
  }

  async getReservationsByUserId(user_id: string) {
    const reservations = this.prisma.reservation.findMany({
      where: {
        user_id,
      },
      include: {
        car: {
          include: {
            brand: true,
          },
        },
        location: true,
      },
    });

    return reservations;
  }

  async updateReservationStatus(
    reservation_id: string,
    action: ReservationStatus,
  ) {
    return this.prisma.reservation.update({
      where: { reservation_id },
      data: { reservation_status: action },
    });
  }

  async getPendingReservations() {
    const reservations = this.prisma.reservation.findMany({
      where: {
        reservation_status: 'pending',
      },
      include: {
        car: {
          include: {
            brand: true,
          },
        },
        location: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return reservations;
  }
}
