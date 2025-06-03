import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '@prisma/client';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            updatePaymentStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('updatePaymentStatus', () => {
    const reservationId = 'res-123';
    const paymentStatus: PaymentStatus = 'paid';

    it('powinien wywołać paymentsService.updatePaymentStatus z poprawnymi parametrami', async () => {
      jest.spyOn(service, 'updatePaymentStatus').mockResolvedValue({} as any);

      await controller.updatePaymentStatus(reservationId, paymentStatus);
      expect(service.updatePaymentStatus).toHaveBeenCalledWith(
        reservationId,
        paymentStatus,
      );
    });

    it('powinien zwrócić wynik z paymentsService.updatePaymentStatus', async () => {
      const mockPayment = {
        reservation_id: reservationId,
        status: paymentStatus,
      };
      jest
        .spyOn(service, 'updatePaymentStatus')
        .mockResolvedValue(mockPayment as any);

      expect(
        await controller.updatePaymentStatus(reservationId, paymentStatus),
      ).toEqual(mockPayment);
    });

    it('powinien rzucić błąd, jeśli brakuje id', async () => {
      await expect(
        controller.updatePaymentStatus(undefined as any, paymentStatus),
      ).rejects.toThrow('Brakuje id lub status');
    });

    it('powinien rzucić błąd, jeśli brakuje statusu płatności', async () => {
      await expect(
        controller.updatePaymentStatus(reservationId, undefined as any),
      ).rejects.toThrow('Brakuje id lub status');
    });
  });
});
