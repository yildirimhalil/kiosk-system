import { Injectable, NotFoundException } from '@nestjs/common';
import { KitchenRepository } from './kitchen.repository';
import { KitchenTicketResponseDto } from 'src/order/dtos/ktichen-ticket-response.dto';
import { KitchenStatus } from '@prisma/client';

@Injectable()
export class KitchenService {
  constructor(private readonly kitchenRepo: KitchenRepository) {}

  async createTicket(orderId: string): Promise<KitchenTicketResponseDto> {
    const ticket = await this.kitchenRepo.createTicket(orderId);
    return {
      id: ticket.id,
      orderId: ticket.orderId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async updateTicketStatus(
    id: string,
    status: KitchenStatus,
  ): Promise<KitchenTicketResponseDto> {
    const ticket = await this.kitchenRepo.updateTicketStatus(id, status);
    return {
      id: ticket.id,
      orderId: ticket.orderId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async getTicketById(id: string): Promise<KitchenTicketResponseDto> {
    const ticket = await this.kitchenRepo.getTicketById(id);
    if (!ticket)
      throw new NotFoundException(`Kitchen ticket with id ${id} not found`);
    return {
      id: ticket.id,
      orderId: ticket.orderId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async getTicketByOrderId(
    orderId: string,
  ): Promise<KitchenTicketResponseDto | null> {
    const ticket = await this.kitchenRepo.getTicketByOrderId(orderId);
    if (!ticket) return null;
    return {
      id: ticket.id,
      orderId: ticket.orderId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async getTickets(
    branchId: string,
    statuses?: KitchenStatus[],
  ): Promise<KitchenTicketResponseDto[]> {
    const tickets = await this.kitchenRepo.getTicketsByBranch(
      branchId,
      statuses,
    );
    return tickets.map<KitchenTicketResponseDto>((t) => ({
      id: t.id,
      orderId: t.orderId,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }
}
