import { IsEnum, IsNumber, Min } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class PaymentProcessRequestDto {
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsNumber()
  @Min(0)
  amount: number;
}
