import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('BrandsService', () => {
  let service: BrandsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: PrismaService,
          useValue: {
            brand: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBrands', () => {
    it('powinien zwrócić wszystkie marki', async () => {
      const mockBrands = [
        { id: 1, brand_id: 'brand1', brand_name: 'Brand A' },
        { id: 2, brand_id: 'brand2', brand_name: 'Brand B' },
      ];
      jest.spyOn(prismaService.brand, 'findMany').mockResolvedValue(mockBrands);

      const result = await service.getAllBrands();
      expect(prismaService.brand.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockBrands);
    });

    it('powinien zwrócić pustą tablicę, jeśli w bazie nie ma marek', async () => {
      jest.spyOn(prismaService.brand, 'findMany').mockResolvedValue([]);

      const result = await service.getAllBrands();
      expect(result).toEqual([]);
    });
  });
});
