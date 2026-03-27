import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NumberingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async incrementDailyCounter(branchId: string, date: Date): Promise<number> {
    const counter = await this.prisma.branchOrderCounter.upsert({
      where: {
        branchId_date: {
          branchId,
          date,
        },
      },
      update: {
        counter: {
          increment: 1,
        },
      },
      create: {
        branchId,
        date,
        counter: 1,
      },
    });

    return counter.counter;
  }
}
