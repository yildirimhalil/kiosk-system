import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  createOrder(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({
      data,
      include: {
        items: { include: { modifiers: true } },
        payments: true,
        table: true,
        kitchenTicket: true,
      },
    });
  }

  getOrder(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { modifiers: true } },
        payments: true,
        table: true,
        kitchenTicket: true,
      },
    });
  }

  getOrders(branchId: string, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: { branchId, ...(status && { status }) },
      include: {
        items: { include: { modifiers: true } },
        payments: true,
        table: true,
        kitchenTicket: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateOrderStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
