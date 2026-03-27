import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CategoryModule } from './menu/category/category.module';
import { MenuModule } from './menu/menu/menu.module';
import { ProductModule } from './menu/product/product.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { TableModule } from './table/table.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrderModule,
    KitchenModule,
    CategoryModule,
    MenuModule,
    ProductModule,
    TableModule,
    PaymentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
