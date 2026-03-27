import { createKeyv } from '@keyv/redis';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { CacheModule, type CacheManagerOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { envInt } from './config/env';
import { Cfg } from './config/cfg-keys';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { TableModule } from './table/table.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redis: RedisService): CacheManagerOptions => {
        const ttl = envInt(Cfg.cache.ttlMs, 30_000);
        const redisUrl = process.env[Cfg.redis.url];
        if (redis.isEnabled() && redisUrl) {
          return {
            stores: [createKeyv(redisUrl)],
            ttl,
          };
        }
        return { ttl };
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: (redis: RedisService) => {
        const throttlers = [
          {
            name: 'default',
            ttl: envInt(Cfg.ttl.ms, 60_000),
            limit: envInt(Cfg.limit.global, 120),
          },
        ];
        if (redis.isEnabled() && redis.getClient()) {
          return {
            throttlers,
            storage: new ThrottlerStorageRedisService(redis.getClient()!),
          };
        }
        return { throttlers };
      },
    }),
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
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
