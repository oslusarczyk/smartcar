import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prismaService: PrismaService;

  const mockPrismaTx = {
    reservation: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
    car: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn((callback) => callback(mockPrismaTx)),
            car: {
              findUnique: jest.fn(),
            },
            reservation: {
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('addReservation', () => {
    const commonArgs = {
      startDateStr: '2024-03-10T10:00:00.000Z',
      endDateStr: '2024-03-15T10:00:00.000Z',
      locationId: 'loc-1',
      carId: 'car-1',
      userId: 'user-1',
    };
    const carPrice = 50;

    beforeEach(() => {
      jest.spyOn(prismaService.car, 'findUnique').mockResolvedValue({
        price_per_day: carPrice,
      } as any);
      mockPrismaTx.reservation.create.mockResolvedValue({
        reservation_id: 'new-res-id',
        ...commonArgs,
        reservation_price: 250,
      } as any);
      mockPrismaTx.payment.create.mockResolvedValue({
        payment_id: 'new-pay-id',
      } as any);
    });

    it('powinien dodać rezerwację i płatność z poprawnymi danymi', async () => {
      const result = await service.addReservation(
        commonArgs.startDateStr,
        commonArgs.endDateStr,
        commonArgs.locationId,
        commonArgs.carId,
        commonArgs.userId,
      );

      expect(prismaService.car.findUnique).toHaveBeenCalledWith({
        where: { car_id: commonArgs.carId },
        select: { price_per_day: true },
      });
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaTx.reservation.create).toHaveBeenCalledWith({
        data: {
          reservation_start_date: new Date(commonArgs.startDateStr),
          reservation_end_date: new Date(commonArgs.endDateStr),
          location_id: commonArgs.locationId,
          car_id: commonArgs.carId,
          user_id: commonArgs.userId,
          reservation_price: 250,
        },
      });
      expect(mockPrismaTx.payment.create).toHaveBeenCalledWith({
        data: {
          reservation_id: 'new-res-id',
          amount: 250,
        },
      });
      expect(result).toEqual({
        reservation: {
          reservation_id: 'new-res-id',
          ...commonArgs,
          reservation_price: 250,
        },
        payment: {
          payment_id: 'new-pay-id',
        },
      });
    });

    it('powinien rzucić BadRequestException dla złego formatu daty', async () => {
      await expect(
        service.addReservation(
          'invalid-date',
          '2024-03-15',
          'loc-1',
          'car-1',
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.addReservation(
          'invalid-date',
          '2024-03-15',
          'loc-1',
          'car-1',
          'user-1',
        ),
      ).rejects.toThrow('Zły format daty');
    });

    it('powinien rzucić BadRequestException, jeśli data końcowa jest wcześniejsza niż początkowa', async () => {
      await expect(
        service.addReservation(
          '2024-03-15',
          '2024-03-10',
          'loc-1',
          'car-1',
          'user-1',
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.addReservation(
          '2024-03-15',
          '2024-03-10',
          'loc-1',
          'car-1',
          'user-1',
        ),
      ).rejects.toThrow('Data końcowa musi być późniejsza niż początkowa');
    });

    it('powinien obliczyć cenę rezerwacji poprawnie', async () => {
      const customStartDate = '2024-03-01T00:00:00.000Z';
      const customEndDate = '2024-03-03T00:00:00.000Z';
      const expectedPrice = carPrice * 2;

      mockPrismaTx.reservation.create.mockResolvedValue({
        reservation_id: 'new-res-id-2',
        ...commonArgs,
        reservation_price: expectedPrice,
      } as any);

      await service.addReservation(
        customStartDate,
        customEndDate,
        commonArgs.locationId,
        commonArgs.carId,
        commonArgs.userId,
      );

      expect(mockPrismaTx.reservation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reservation_price: expectedPrice,
          }),
        }),
      );
    });

    it('powinien obsłużyć brak ceny samochodu jako 0', async () => {
      jest.spyOn(prismaService.car, 'findUnique').mockResolvedValue(null);

      mockPrismaTx.reservation.create.mockResolvedValue({
        reservation_id: 'new-res-id-3',
        ...commonArgs,
        reservation_price: 0,
      } as any);

      await service.addReservation(
        commonArgs.startDateStr,
        commonArgs.endDateStr,
        commonArgs.locationId,
        commonArgs.carId,
        commonArgs.userId,
      );

      expect(mockPrismaTx.reservation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reservation_price: 0,
          }),
        }),
      );
    });
  });

  describe('getReservationsByUserId', () => {
    it('powinien zwrócić listę rezerwacji dla danego użytkownika', async () => {
      const userId = 'user-test-id';
      const mockReservations = [
        {
          reservation_id: 'res-1',
          user_id: userId,
          car: { model: 'Car A', brand: { brand_name: 'Brand X' } },
          location: { location_name: 'Loc 1' },
        },
      ];
      jest
        .spyOn(prismaService.reservation, 'findMany')
        .mockResolvedValue(mockReservations as any);

      const result = await service.getReservationsByUserId(userId);
      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: {
          car: { include: { brand: true } },
          location: true,
        },
      });
      expect(result).toEqual(mockReservations);
    });

    it('powinien zwrócić pustą tablicę, jeśli użytkownik nie ma rezerwacji', async () => {
      jest.spyOn(prismaService.reservation, 'findMany').mockResolvedValue([]);

      const result = await service.getReservationsByUserId('non-existent-user');
      expect(result).toEqual([]);
    });
  });

  describe('updateReservationStatus', () => {
    const reservationId = 'res-to-update';
    const newStatus: ReservationStatus = 'confirmed';
    const mockUpdatedReservation = {
      reservation_id: reservationId,
      reservation_status: newStatus,
    };

    it('powinien zaktualizować status rezerwacji', async () => {
      jest
        .spyOn(prismaService.reservation, 'update')
        .mockResolvedValue(mockUpdatedReservation as any);

      const result = await service.updateReservationStatus(
        reservationId,
        newStatus,
      );
      expect(prismaService.reservation.update).toHaveBeenCalledWith({
        where: { reservation_id: reservationId },
        data: { reservation_status: newStatus },
      });
      expect(result).toEqual(mockUpdatedReservation);
    });
  });

  describe('getPendingReservations', () => {
    it('powinien zwrócić listę oczekujących rezerwacji', async () => {
      const mockPendingReservations = [
        {
          reservation_id: 'res-pending-1',
          reservation_status: 'pending',
          car: { model: 'Car Z', brand: { brand_name: 'Brand Z' } },
          location: { location_name: 'Loc Z' },
          user: { email: 'user@example.com' },
        },
      ];
      jest
        .spyOn(prismaService.reservation, 'findMany')
        .mockResolvedValue(mockPendingReservations as any);

      const result = await service.getPendingReservations();
      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { reservation_status: 'pending' },
        include: {
          car: { include: { brand: true } },
          location: true,
          user: { select: { email: true } },
        },
      });
      expect(result).toEqual(mockPendingReservations);
    });

    it('powinien zwrócić pustą tablicę, jeśli brak oczekujących rezerwacji', async () => {
      jest.spyOn(prismaService.reservation, 'findMany').mockResolvedValue([]);

      const result = await service.getPendingReservations();
      expect(result).toEqual([]);
    });
  });
});
