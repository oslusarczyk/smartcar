import { LocationDto } from './location.dto';

describe('LocationDto', () => {
  it('powinien być zdefiniowany', () => {
    expect(new LocationDto()).toBeDefined();
  });

  it('powinien mieć właściwości location_id i location_name', () => {
    const locationDto = new LocationDto();
    locationDto.location_id = 'loc-id-123';
    locationDto.location_name = 'Test Location Name';

    expect(locationDto.location_id).toBe('loc-id-123');
    expect(locationDto.location_name).toBe('Test Location Name');
  });
});
