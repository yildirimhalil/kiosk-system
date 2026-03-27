import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from '@nestjs/class-transformer';
import { CreateOrderItemDto } from './order-item-request.dto';
import { PaymentResponseDto } from './payment-response.dto';
import { KitchenTicketResponseDto } from './ktichen-ticket-response.dto';
import { TableResponseDto } from './table-response.dto';

export class OrderResponseDto {
  @IsString()
  id: string;

  @IsString()
  branchId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TableResponseDto)
  table?: TableResponseDto;

  @IsInt()
  orderNumber: number;

  @IsString()
  source: string;

  @IsString()
  status: string;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  paidAmount: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ValidateNested({ each: true })
  @Type(() => PaymentResponseDto)
  payments: PaymentResponseDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => KitchenTicketResponseDto)
  kitchenTicket?: KitchenTicketResponseDto;

  @IsOptional()
  createdById?: string;

  createdAt: Date;
  updatedAt: Date;
}
