import { BrandDto } from './brand.dto';

describe('BrandDto', () => {
  it('powinien być zdefiniowany', () => {
    expect(new BrandDto()).toBeDefined();
  });

  it('powinien mieć właściwości brand_id i brand_name', () => {
    const brandDto = new BrandDto();
    brandDto.brand_id = 'test-id-123';
    brandDto.brand_name = 'Test Brand';

    expect(brandDto.brand_id).toBe('test-id-123');
    expect(brandDto.brand_name).toBe('Test Brand');
  });
});
