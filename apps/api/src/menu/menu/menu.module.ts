import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MenuService } from './menu.service';
import { MenuRepository } from './menu.repository';

@Module({
  imports: [PrismaModule],
  providers: [MenuService, MenuRepository],
  exports: [MenuService],
})
export class MenuModule {}
