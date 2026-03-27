import { Injectable } from '@nestjs/common';
import { TableRepository } from './table.repository';
import { CreateTableRequestDto } from './dtos/create-table-request.dto';
import { UpdateTableRequestDto } from './dtos/update-table-request.dto';

@Injectable()
export class TableService {
  constructor(private readonly repository: TableRepository) {}

  async createTable(dto: CreateTableRequestDto) {
    return this.repository.createTable({
      number: dto.number,
      status: dto.status,
      branch: { connect: { id: dto.branchId } },
    });
  }

  async getTable(id: string) {
    return this.repository.getTable(id);
  }

  async getTables(branchId: string) {
    return this.repository.getTables(branchId);
  }

  async updateTable(id: string, dto: UpdateTableRequestDto) {
    return this.repository.updateTable(id, { ...dto });
  }

  async deleteTable(id: string) {
    return this.repository.deleteTable(id);
  }
}
