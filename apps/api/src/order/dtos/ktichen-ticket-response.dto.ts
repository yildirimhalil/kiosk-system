// order/dto/kitchen-ticket-response.dto.ts
import { IsDate, IsString } from 'class-validator';

export class KitchenTicketResponseDto {
  @IsString()
  id: string;

  @IsString()
  orderId: string;

  @IsString()
  status: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
