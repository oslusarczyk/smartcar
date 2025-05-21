import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationStatus } from '@prisma/client';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}
  @Get()
  async getReservationsByUserId(
    @Query('user_id') user_id: string,
    @Query('status') status: ReservationStatus,
  ) {
    if (!user_id || !status) {
      throw new Error('Missing user_id or status');
    }
    return this.reservationsService.getReservationsByUserId(user_id, status);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getPendingReservations() {
    return this.reservationsService.getPendingReservations();
  }

  @Post()
  async addReservation(@Body() body) {
    const {
      reservation_start_date,
      reservation_end_date,
      location_id,
      car_id,
      user_id,
    } = body;
    if (
      !reservation_start_date ||
      !reservation_end_date ||
      !location_id ||
      !car_id ||
      !user_id
    ) {
      throw new Error('Missing required fields');
    }
    return this.reservationsService.addReservation(
      reservation_start_date.toString(),
      reservation_end_date.toString(),
      location_id,
      car_id,
      user_id,
    );
  }

  @Put(':id')
  async updateReservationStatus(
    @Param('id') id: string,
    @Body('status') reservation_status: ReservationStatus,
  ) {
    if (!id || !reservation_status) {
      throw new Error('Missing reservation ID or action');
    }
    return this.reservationsService.updateReservationStatus(
      id,
      reservation_status,
    );
  }
}
