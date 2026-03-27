import { Body, Controller, Post, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentProcessRequestDto } from './dtos/payment-process-request.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':orderId/process')
  async processPayment(
    @Param('orderId') orderId: string,
    @Body() dto: PaymentProcessRequestDto,
  ) {
    return this.paymentService.processPayment(
      orderId,
      dto.provider,
      dto.amount,
    );
  }
}
