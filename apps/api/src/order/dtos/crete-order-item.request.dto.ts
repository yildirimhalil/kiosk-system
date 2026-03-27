import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from '@nestjs/class-transformer';
import { OrderItemModifierRequestDto } from './order-item-modifier-request.dto';

export class CreateOrderItemRequestDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemModifierRequestDto)
  modifiers?: OrderItemModifierRequestDto[];
}
