import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { KitchenService } from './kitchen.service';
import { KitchenTicketResponseDto } from 'src/order/dtos/ktichen-ticket-response.dto';
import { KitchenStatus } from '@prisma/client';

@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Post('tickets')
  async createTicket(
    @Body('orderId') orderId: string,
  ): Promise<KitchenTicketResponseDto> {
    return this.kitchenService.createTicket(orderId);
  }

  @Post('tickets/:id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: KitchenStatus,
  ): Promise<KitchenTicketResponseDto> {
    return this.kitchenService.updateTicketStatus(id, status);
  }

  @Get('tickets/:id')
  async getTicketById(
    @Param('id') id: string,
  ): Promise<KitchenTicketResponseDto> {
    return this.kitchenService.getTicketById(id);
  }

  @Get('order/:orderId')
  async getTicketByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<KitchenTicketResponseDto | null> {
    return this.kitchenService.getTicketByOrderId(orderId);
  }

  @Get('tickets')
  async getTickets(
    @Query('branchId') branchId: string,
    @Query('statuses') statuses?: KitchenStatus[],
  ): Promise<KitchenTicketResponseDto[]> {
    return this.kitchenService.getTickets(branchId, statuses);
  }
}
