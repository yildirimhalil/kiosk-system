import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCategory(data: Prisma.MenuCategoryCreateInput) {
    return this.prisma.menuCategory.create({ data });
  }

  async getCategory(id: string) {
    return this.prisma.menuCategory.findUnique({ where: { id } });
  }

  async getCategories(menuId: string) {
    return this.prisma.menuCategory.findMany({
      where: { menuId, deletedAt: null },
    });
  }

  async updateCategory(id: string, data: Prisma.MenuCategoryUpdateInput) {
    return this.prisma.menuCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    return this.prisma.menuCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
