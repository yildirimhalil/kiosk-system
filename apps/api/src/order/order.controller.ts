import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './dtos/create-order-request.dto';
import { OrderStatus } from './enums/order-status.enum';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderRequestDto) {
    return this.orderService.createOrder(dto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Get()
  async getOrders(
    @Query('branchId') branchId: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderService.getOrders(branchId, status);
  }
}
