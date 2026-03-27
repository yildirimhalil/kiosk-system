import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PaymentResponseDto {
  @IsString()
  id: string;

  @IsString()
  provider: string;

  @IsString()
  status: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  paidAt?: Date;
}
