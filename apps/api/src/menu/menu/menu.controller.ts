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
import { MenuService } from './menu.service';
import { CreateMenuRequestDto } from './dtos/create-menu-request.dto';
import { UpdateMenuRequestDto } from './dtos/update-menu-request.dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  @Post()
  async createMenu(@Body() dto: CreateMenuRequestDto) {
    return this.service.createMenu(dto);
  }

  @Get(':id')
  async getMenu(@Param('id') id: string) {
    return this.service.getMenu(id);
  }

  @Get()
  async getMenus(@Query('branchId') branchId: string) {
    return this.service.getMenus(branchId);
  }

  @Put(':id')
  async updateMenu(@Param('id') id: string, @Body() dto: UpdateMenuRequestDto) {
    return this.service.updateMenu(id, dto);
  }

  @Delete(':id')
  async deleteMenu(@Param('id') id: string) {
    return this.service.deleteMenu(id);
  }
}
