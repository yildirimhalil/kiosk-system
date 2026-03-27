import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './kitchen.service';
import { KitchenRepository } from './kitchen.repository';

@Module({
  imports: [PrismaModule],
  controllers: [KitchenController],
  providers: [KitchenService, KitchenRepository],
})
export class KitchenModule {}
