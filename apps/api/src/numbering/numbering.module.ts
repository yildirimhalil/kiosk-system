import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NumberingService } from './numbering.service';
import { NumberingRepository } from './numbering.repository';

@Module({
  imports: [PrismaModule],
  providers: [NumberingService, NumberingRepository],
  exports: [NumberingService],
})
export class NumberingModule {}
