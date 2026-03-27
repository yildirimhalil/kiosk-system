import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus as PrismaOrderStatus,
  PaymentStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import type { AuthUser } from 'src/common/decorators/current-user.decorator';
import { PaymentProcessRequestDto } from './dtos/payment-process-request.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaClient) {}

  async processPayment(
    orderId: string,
    dto: PaymentProcessRequestDto,
    authUser: AuthUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: orderId,
          branchId: authUser.branchId,
          deletedAt: null,
        },
        include: { payments: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== PrismaOrderStatus.CREATED) {
        throw new BadRequestException(
          `Payment only allowed when order is CREATED (current: ${order.status})`,
        );
      }

      const expectedTotal = new Prisma.Decimal(order.totalAmount);
      const received = new Prisma.Decimal(dto.amount);
      if (!expectedTotal.equals(received)) {
        throw new BadRequestException(
          `Amount must equal order total (${expectedTotal.toString()})`,
        );
      }

      const alreadyPaid = order.payments.some(
        (p) => p.status === PaymentStatus.SUCCESS,
      );
      if (alreadyPaid) {
        throw new ConflictException('Order is already paid');
      }

      if (dto.idempotencyKey) {
        const replay = await tx.paymentTransaction.findFirst({
          where: {
            orderId,
            reference: dto.idempotencyKey,
            status: PaymentStatus.SUCCESS,
          },
        });
        if (replay) {
          return replay;
        }
      }

      const initiated = await tx.paymentTransaction.create({
        data: {
          order: { connect: { id: orderId } },
          provider: dto.provider,
          status: PaymentStatus.INITIATED,
          amount: received,
          reference: dto.idempotencyKey ?? null,
        },
      });

      const paidAt = new Date();
      const completed = await tx.paymentTransaction.update({
        where: { id: initiated.id },
        data: { status: PaymentStatus.SUCCESS, paidAt },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: PrismaOrderStatus.PAID,
          paidAmount: expectedTotal,
        },
      });

      return completed;
    });
  }
}
