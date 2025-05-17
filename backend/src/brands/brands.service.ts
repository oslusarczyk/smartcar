import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}
  getAllBrands() {
    return this.prisma.brand.findMany();
  }
}
