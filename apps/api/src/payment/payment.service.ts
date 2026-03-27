import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { OrderRepository } from 'src/order/order.repository';
import { PaymentProvider, PaymentStatus } from '@prisma/client';
import { OrderStatus } from 'src/order/enums/order-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly orderRepo: OrderRepository,
  ) {}

  async processPayment(
    orderId: string,
    provider: PaymentProvider,
    amount: number,
  ) {
    const payment = await this.paymentRepo.createPayment({
      order: { connect: { id: orderId } },
      provider,
      status: PaymentStatus.INITIATED,
      amount,
    });

    // Ödeme onayı sonrası
    // Simülasyon: başarılı ödeme
    const paidAt = new Date();
    await this.paymentRepo.updatePaymentStatus(
      payment.id,
      PaymentStatus.SUCCESS,
      paidAt,
    );

    // Order status update
    await this.orderRepo.updateOrderStatus(orderId, OrderStatus.PAID);

    return payment;
  }
}
