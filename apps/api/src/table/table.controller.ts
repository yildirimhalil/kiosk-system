import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableRequestDto } from './dtos/create-table-request.dto';
import { UpdateTableRequestDto } from './dtos/update-table-request.dto';

@Controller('tables')
export class TableController {
  constructor(private readonly service: TableService) {}

  @Post()
  async createTable(@Body() dto: CreateTableRequestDto) {
    return this.service.createTable(dto);
  }

  @Get(':id')
  async getTable(@Param('id') id: string) {
    return this.service.getTable(id);
  }

  @Get()
  async getTables(@Query('branchId') branchId: string) {
    return this.service.getTables(branchId);
  }

  @Put(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() dto: UpdateTableRequestDto,
  ) {
    return this.service.updateTable(id, dto);
  }

  @Delete(':id')
  async deleteTable(@Param('id') id: string) {
    return this.service.deleteTable(id);
  }
}
