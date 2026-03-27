import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

@Module({
  imports: [PrismaModule],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
