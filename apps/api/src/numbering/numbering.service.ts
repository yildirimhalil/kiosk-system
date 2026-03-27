import { Injectable } from '@nestjs/common';
import { NumberingRepository } from './numbering.repository';

@Injectable()
export class NumberingService {
  constructor(private readonly repository: NumberingRepository) {}

  async next(branchId: string): Promise<number> {
    const today = this.normalizeDate(new Date());

    return this.repository.incrementDailyCounter(branchId, today);
  }

  /**
   * Tarihi gün bazına normalize eder
   * (00:00:00.000)
   */
  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
