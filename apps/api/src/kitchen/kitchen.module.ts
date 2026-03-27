import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { KitchenService } from './kitchen.service';
import { KitchenRepository } from './kitchen.repository';

@Module({
  imports: [PrismaModule],
  providers: [KitchenService, KitchenRepository],
})
export class KitchenModule {}
