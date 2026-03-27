import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Menu } from '@prisma/client';

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaClient) {}

  createMenu(data: Prisma.MenuCreateInput): Promise<Menu> {
    return this.prisma.menu.create({ data });
  }

  getMenu(id: string): Promise<Menu | null> {
    return this.prisma.menu.findUnique({ where: { id } });
  }

  getMenus(branchId: string): Promise<Menu[]> {
    return this.prisma.menu.findMany({ where: { branchId } });
  }

  updateMenu(id: string, data: Prisma.MenuUpdateInput): Promise<Menu> {
    return this.prisma.menu.update({ where: { id }, data });
  }

  deleteMenu(id: string): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
