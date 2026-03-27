import { Injectable } from '@nestjs/common';
import { KitchenTicket, KitchenStatus, PrismaClient } from '@prisma/client';

@Injectable()
export class KitchenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createTicket(orderId: string): Promise<KitchenTicket> {
    return this.prisma.kitchenTicket.create({
      data: { orderId, status: 'NEW' },
    });
  }

  async updateTicketStatus(
    id: string,
    status: KitchenStatus,
  ): Promise<KitchenTicket> {
    return this.prisma.kitchenTicket.update({
      where: { id },
      data: { status },
    });
  }

  async getTicketById(id: string): Promise<KitchenTicket | null> {
    return this.prisma.kitchenTicket.findUnique({
      where: { id },
      include: {
        order: { include: { items: true } },
      },
    });
  }

  async getTicketByOrderId(orderId: string): Promise<KitchenTicket | null> {
    return this.prisma.kitchenTicket.findUnique({
      where: { orderId },
    });
  }

  async getTicketsByBranch(
    branchId: string,
    statuses?: KitchenStatus[],
  ): Promise<KitchenTicket[]> {
    return this.prisma.kitchenTicket.findMany({
      where: {
        order: { branchId },
        status: statuses ? { in: statuses } : undefined,
      },
      include: {
        order: { include: { items: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
