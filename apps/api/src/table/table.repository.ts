import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Table } from '@prisma/client';

@Injectable()
export class TableRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createTable(data: Prisma.TableCreateInput): Promise<Table> {
    return this.prisma.table.create({ data });
  }

  async getTable(id: string): Promise<Table | null> {
    return this.prisma.table.findUnique({ where: { id } });
  }

  async getTables(branchId: string): Promise<Table[]> {
    return this.prisma.table.findMany({
      where: { branchId, deletedAt: null },
      orderBy: { number: 'asc' },
    });
  }

  async updateTable(id: string, data: Prisma.TableUpdateInput): Promise<Table> {
    return this.prisma.table.update({ where: { id }, data });
  }

  async deleteTable(id: string): Promise<Table> {
    return this.prisma.table.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
