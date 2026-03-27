import { IsInt, IsNumber, IsString, Min } from 'class-validator';
import { OrderItemModifierRequestDto } from './order-item-modifier-request.dto';
export class CreateOrderItemDto {
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

  modifiers?: OrderItemModifierRequestDto[];
}
