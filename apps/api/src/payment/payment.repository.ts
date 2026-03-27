import { Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  createPayment(data: Prisma.PaymentTransactionCreateInput) {
    return this.prisma.paymentTransaction.create({ data });
  }

  updatePaymentStatus(id: string, status: PaymentStatus, paidAt?: Date) {
    return this.prisma.paymentTransaction.update({
      where: { id },
      data: { status, paidAt },
    });
  }

  findByOrderId(orderId: string) {
    return this.prisma.paymentTransaction.findMany({
      where: { orderId },
    });
  }
}
