import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from '@nestjs/class-transformer';
import { OrderSource } from '../enums/order-source.enum';
import { CreateOrderItemDto } from './order-item-request.dto';

export class CreateOrderRequestDto {
  @IsString()
  branchId: string;

  @IsEnum(OrderSource)
  source: OrderSource;

  @IsOptional()
  @IsString()
  tableId?: string;

  @IsOptional()
  @IsString()
  createdById?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items: CreateOrderItemDto[];
}
