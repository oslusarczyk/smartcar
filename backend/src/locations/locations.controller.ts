import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  getAllLocations() {
    return this.locationsService.getAllLocations();
  }

  @Get(':id')
  getLocationsByCar(@Param('id') id: string) {
    return this.locationsService.getLocationsByCar(id);
  }
}
