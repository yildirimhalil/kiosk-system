import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderRepository } from './order.repository';
import { NumberingService } from 'src/numbering/numbering.service';
import { CreateOrderRequestDto } from './dtos/create-order-request.dto';
import { OrderResponseDto } from './dtos/order-reponse.dto';
import { OrderStatus } from './enums/order-status.enum';
import { OrderSource } from './enums/order-source.enum';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { modifiers: true } };
    payments: true;
    table: true;
    kitchenTicket: true;
  };
}>;

@Injectable()
export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly numberingService: NumberingService,
  ) {}

  async createOrder(dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    this.validateSourceRules(dto);
    const orderNumber = await this.numberingService.next(dto.branchId);
    const totalAmount = this.calculateTotal(dto.items);

    const order = await this.repository.createOrder({
      branch: { connect: { id: dto.branchId } },
      table: dto.tableId ? { connect: { id: dto.tableId } } : undefined,
      createdById: dto.createdById ?? null,
      source: dto.source,
      status: OrderStatus.CREATED,
      orderNumber,
      totalAmount,
      paidAmount: 0,
      items: {
        create: dto.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          modifiers: { create: item.modifiers ?? [] },
        })),
      },
    });

    return this.toResponseDto(order);
  }

  async getOrder(id: string): Promise<OrderResponseDto> {
    const order = await this.repository.getOrder(id);
    if (!order) throw new BadRequestException('Order not found');
    return this.toResponseDto(order);
  }

  async getOrders(
    branchId: string,
    status?: OrderStatus,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.repository.getOrders(branchId, status);
    return orders.map((o) => this.toResponseDto(o));
  }

  private validateSourceRules(dto: CreateOrderRequestDto) {
    if (dto.source === OrderSource.QR && !dto.tableId)
      throw new BadRequestException('QR order için tableId zorunlu');
    if (dto.source === OrderSource.CASHIER && !dto.createdById)
      throw new BadRequestException('Cashier order için createdById zorunlu');
  }

  private calculateTotal(items: CreateOrderRequestDto['items']) {
    return items.reduce((sum, item) => {
      const modifiersTotal =
        item.modifiers?.reduce((m, mod) => m + mod.price, 0) ?? 0;
      return sum + (item.unitPrice + modifiersTotal) * item.quantity;
    }, 0);
  }

  private toResponseDto(order: OrderWithRelations): OrderResponseDto {
    return {
      id: order.id,
      branchId: order.branchId,
      table: order.table ?? undefined,
      orderNumber: order.orderNumber,
      source: order.source,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      paidAmount: Number(order.paidAmount),
      items: order.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.name,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        modifiers: i.modifiers.map((m) => ({
          id: m.id,
          name: m.name,
          price: Number(m.price),
        })),
      })),
      payments: order.payments.map((p) => ({
        id: p.id,
        provider: p.provider,
        status: p.status,
        amount: Number(p.amount),
        paidAt: p.paidAt ?? undefined,
      })),
      kitchenTicket: order.kitchenTicket ?? undefined,
      createdById: order.createdById ?? undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
