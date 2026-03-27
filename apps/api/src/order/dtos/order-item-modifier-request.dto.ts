import { IsNumber, IsString, Min } from 'class-validator';

export class OrderItemModifierRequestDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
