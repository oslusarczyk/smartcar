import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
          useValue: {
            getAllBrands: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get<BrandsService>(BrandsService);
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBrands', () => {
    it('powinien wywołać brandsService.getAllBrands', async () => {
      const mockBrands = [{ brand_id: '1', brand_name: 'Test Brand' }];
      jest.spyOn(service, 'getAllBrands').mockResolvedValue(mockBrands);

      const result = await controller.getAllBrands();
      expect(service.getAllBrands).toHaveBeenCalled();
      expect(result).toEqual(mockBrands);
    });

    it('powinien zwrócić pustą tablicę, jeśli brak marek', async () => {
      jest.spyOn(service, 'getAllBrands').mockResolvedValue([]);

      const result = await controller.getAllBrands();
      expect(result).toEqual([]);
    });
  });
});
