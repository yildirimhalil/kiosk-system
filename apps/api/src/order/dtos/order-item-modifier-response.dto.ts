import { IsString, IsNumber } from 'class-validator';

export class OrderItemModifierResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
