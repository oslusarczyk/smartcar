import { Body, Controller, Param, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Put(':id')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('payment_status') payment_status: PaymentStatus,
  ) {
    if (!id || !payment_status) {
      throw new Error('Brakuje id lub status');
    }
    return this.paymentsService.updatePaymentStatus(id, payment_status);
  }
}
