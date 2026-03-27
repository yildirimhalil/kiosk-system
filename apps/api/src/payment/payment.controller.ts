import { Body, Controller, Param, Post } from '@nestjs/common';
import type { AuthUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaymentProcessRequestDto } from './dtos/payment-process-request.dto';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':orderId/process')
  async processPayment(
    @Param('orderId') orderId: string,
    @Body() dto: PaymentProcessRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentService.processPayment(orderId, dto, user);
  }
}
