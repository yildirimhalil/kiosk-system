import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async getProduct(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async getProducts(categoryId: string) {
    return this.prisma.product.findMany({
      where: { categoryId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
