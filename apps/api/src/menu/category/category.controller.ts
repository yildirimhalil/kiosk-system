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
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dtos/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dtos/update-category-request.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  async createCategory(@Body() dto: CreateCategoryRequestDto) {
    return this.service.createCategory(dto);
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return this.service.getCategory(id);
  }

  @Get()
  async getCategories(@Query('menuId') menuId: string) {
    return this.service.getCategories(menuId);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ) {
    return this.service.updateCategory(id, dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.service.deleteCategory(id);
  }
}
