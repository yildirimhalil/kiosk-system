import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TableService } from './table.service';
import { TableRepository } from './table.repository';

@Module({
  imports: [PrismaModule],
  providers: [TableService, TableRepository],
  exports: [TableService],
})
export class TableModule {}
