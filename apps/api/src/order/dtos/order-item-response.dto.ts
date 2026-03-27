import { IsString, IsNumber, IsInt, ValidateNested } from 'class-validator';
import { Type } from '@nestjs/class-transformer';
import { OrderItemModifierResponseDto } from './order-item-modifier-response.dto';

export class OrderItemResponseDto {
  @IsString()
  id: string;

  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  unitPrice: number;

  @IsInt()
  quantity: number;

  @ValidateNested({ each: true })
  @Type(() => OrderItemModifierResponseDto)
  modifiers: OrderItemModifierResponseDto[];
}
