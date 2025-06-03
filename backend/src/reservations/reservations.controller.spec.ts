import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationStatus } from '@prisma/client';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth-guard';
import { ExecutionContext } from '@nestjs/common';

class MockJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
class MockAdminGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: {
            getReservationsByUserId: jest.fn(),
            getPendingReservations: jest.fn(),
            addReservation: jest.fn(),
            updateReservationStatus: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .overrideGuard(AdminGuard)
      .useClass(MockAdminGuard)
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('getReservationsByUserId', () => {
    it('powinien wywołać reservationsService.getReservationsByUserId z poprawnym ID użytkownika', async () => {
      const userId = 'user-test-id';
      jest.spyOn(service, 'getReservationsByUserId').mockResolvedValue([]);

      await controller.getReservationsByUserId(userId);
      expect(service.getReservationsByUserId).toHaveBeenCalledWith(userId);
    });

    it('powinien rzucić błąd, jeśli user_id jest brakujące', async () => {
      await expect(
        controller.getReservationsByUserId(undefined as any),
      ).rejects.toThrow('Brak id.');
    });

    it('powinien zwrócić listę rezerwacji dla danego użytkownika', async () => {
      const mockReservations = [{ reservation_id: '1', user_id: 'user-test' }];
      jest
        .spyOn(service, 'getReservationsByUserId')
        .mockResolvedValue(mockReservations as any);

      expect(await controller.getReservationsByUserId('user-test')).toEqual(
        mockReservations,
      );
    });
  });

  describe('getPendingReservations', () => {
    it('powinien wywołać reservationsService.getPendingReservations', async () => {
      jest.spyOn(service, 'getPendingReservations').mockResolvedValue([]);

      await controller.getPendingReservations();
      expect(service.getPendingReservations).toHaveBeenCalled();
    });

    it('powinien zwrócić listę oczekujących rezerwacji', async () => {
      const mockReservations = [
        { reservation_id: '2', reservation_status: 'pending' },
      ];
      jest
        .spyOn(service, 'getPendingReservations')
        .mockResolvedValue(mockReservations as any);

      expect(await controller.getPendingReservations()).toEqual(
        mockReservations,
      );
    });
  });

  describe('addReservation', () => {
    const mockBody = {
      reservation_start_date: new Date('2024-03-10').toISOString(),
      reservation_end_date: new Date('2024-03-15').toISOString(),
      location_id: 'loc-1',
      car_id: 'car-1',
      user_id: 'user-1',
    };

    const mockResult = {
      reservation: {
        reservation_id: 'new-res-1',
        user_id: mockBody.user_id,
        car_id: mockBody.car_id,
        location_id: mockBody.location_id,
        reservation_start_date: new Date(mockBody.reservation_start_date),
        reservation_end_date: new Date(mockBody.reservation_end_date),
        reservation_price: 500,
        reservation_status: 'pending' as ReservationStatus,
      },
      payment: {
        payment_id: 'new-pay-1',
        reservation_id: 'new-res-1',
        amount: 500,
        status: 'pending' as any,
        payment_date: new Date(),
      },
    };

    it('powinien wywołać reservationsService.addReservation z poprawnymi parametrami', async () => {
      jest.spyOn(service, 'addReservation').mockResolvedValue(mockResult);

      await controller.addReservation(mockBody);
      expect(service.addReservation).toHaveBeenCalledWith(
        mockBody.reservation_start_date,
        mockBody.reservation_end_date,
        mockBody.location_id,
        mockBody.car_id,
        mockBody.user_id,
      );
    });

    it('powinien rzucić błąd, jeśli brakuje wymaganych pól', async () => {
      const incompleteBody = { ...mockBody, car_id: undefined };
      await expect(
        controller.addReservation(incompleteBody as any),
      ).rejects.toThrow('Missing required fields');
    });

    it('powinien zwrócić wynik z reservationsService.addReservation', async () => {
      jest.spyOn(service, 'addReservation').mockResolvedValue(mockResult);

      expect(await controller.addReservation(mockBody)).toEqual(mockResult);
    });
  });

  describe('updateReservationStatus', () => {
    const reservationId = 'res-to-update';
    const status: ReservationStatus = 'confirmed';

    it('powinien wywołać reservationsService.updateReservationStatus z poprawnymi parametrami', async () => {
      jest
        .spyOn(service, 'updateReservationStatus')
        .mockResolvedValue({} as any);

      await controller.updateReservationStatus(reservationId, status);
      expect(service.updateReservationStatus).toHaveBeenCalledWith(
        reservationId,
        status,
      );
    });

    it('powinien rzucić błąd, jeśli brakuje ID rezerwacji', async () => {
      await expect(
        controller.updateReservationStatus(undefined as any, status),
      ).rejects.toThrow('Missing reservation ID or action');
    });

    it('powinien rzucić błąd, jeśli brakuje statusu', async () => {
      await expect(
        controller.updateReservationStatus(reservationId, undefined as any),
      ).rejects.toThrow('Missing reservation ID or action');
    });

    it('powinien zwrócić wynik z reservationsService.updateReservationStatus', async () => {
      const mockResult = {
        reservation_id: reservationId,
        reservation_status: status,
      };
      jest
        .spyOn(service, 'updateReservationStatus')
        .mockResolvedValue(mockResult as any);

      expect(
        await controller.updateReservationStatus(reservationId, status),
      ).toEqual(mockResult);
    });
  });
});
