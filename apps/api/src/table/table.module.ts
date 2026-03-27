import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TableRepository } from './table.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TableController],
  providers: [TableService, TableRepository],
  exports: [TableService],
})
export class TableModule {}
