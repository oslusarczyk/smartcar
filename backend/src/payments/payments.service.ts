import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PaymentStatus, ReservationStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async updatePaymentStatus(id: string, payment_status: PaymentStatus) {
    return await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { reservation_id: id },
        data: { status: payment_status },
        include: { reservation: true },
      });

      const reservationId = payment.reservation_id;

      let reservation_status: ReservationStatus | null = null;
      if (payment_status === 'paid') {
        reservation_status = 'confirmed';
      } else if (payment_status === 'cancelled') {
        reservation_status = 'cancelled';
      }

      if (reservation_status) {
        await tx.reservation.update({
          where: { reservation_id: reservationId },
          data: { reservation_status },
        });
      }

      return payment;
    });
  }
}
