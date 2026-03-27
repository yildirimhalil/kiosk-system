import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { NumberingModule } from 'src/numbering/numbering.module';

@Module({
  imports: [PrismaModule, NumberingModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
