import { Injectable } from '@nestjs/common';
import { LocationDto } from './dto/location.dto';
import { PrismaService } from '@/prisma/prisma.service';
@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}
  getAllLocations() {
    return this.prisma.location.findMany();
  }
}
