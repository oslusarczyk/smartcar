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

      return await this.prisma.reservation.create({
        data: {
          reservation_start_date: startDate,
          reservation_end_date: endDate,
          location_id,
          car_id,
          user_id,
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

  async getReservationsByUserId(user_id: string, status: ReservationStatus) {
    const reservations = this.prisma.reservation.findMany({
      where: {
        user_id,
        reservation_status: status,
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
