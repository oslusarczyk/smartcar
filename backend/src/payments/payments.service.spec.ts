import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PaymentStatus, ReservationStatus } from '@prisma/client';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;

  const mockPrismaTx = {
    payment: {
      update: jest.fn(),
    },
    reservation: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn((callback) => callback(mockPrismaTx)),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('updatePaymentStatus', () => {
    const reservationId = 'res-abc';
    const mockPayment = {
      payment_id: 'pay-123',
      reservation_id: reservationId,
      status: 'pending' as PaymentStatus,
      amount: 100,
      reservation: {
        reservation_id: reservationId,
        reservation_status: 'pending' as ReservationStatus,
        car_id: 'car-1',
        user_id: 'user-1',
        start_date: new Date(),
        end_date: new Date(),
      },
    };

    it('powinien zaktualizować status płatności na "paid" i status rezerwacji na "confirmed"', async () => {
      mockPrismaTx.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'paid',
      });
      mockPrismaTx.reservation.update.mockResolvedValue({} as any);

      const result = await service.updatePaymentStatus(
        reservationId,
        'paid' as PaymentStatus,
      );

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaTx.payment.update).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
        data: { status: 'paid' },
        include: { reservation: true },
      });
      expect(mockPrismaTx.reservation.update).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
        data: { reservation_status: 'confirmed' },
      });
      expect(result.status).toBe('paid');
    });

    it('powinien zaktualizować status płatności na "cancelled" i status rezerwacji na "cancelled"', async () => {
      mockPrismaTx.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'cancelled',
      });
      mockPrismaTx.reservation.update.mockResolvedValue({} as any);

      const result = await service.updatePaymentStatus(
        reservationId,
        'cancelled' as PaymentStatus,
      );

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaTx.payment.update).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
        data: { status: 'cancelled' },
        include: { reservation: true },
      });
      expect(mockPrismaTx.reservation.update).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
        data: { reservation_status: 'cancelled' },
      });
      expect(result.status).toBe('cancelled');
    });

    it('powinien zaktualizować status płatności, ale nie status rezerwacji dla "pending"', async () => {
      mockPrismaTx.payment.update.mockResolvedValue({
        ...mockPayment,
        status: 'pending',
      });

      const result = await service.updatePaymentStatus(
        reservationId,
        'pending' as PaymentStatus,
      );

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaTx.payment.update).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
        data: { status: 'pending' },
        include: { reservation: true },
      });
      expect(mockPrismaTx.reservation.update).not.toHaveBeenCalled();
      expect(result.status).toBe('pending');
    });
  });
});
