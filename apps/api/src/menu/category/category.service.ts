import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryRequestDto } from './dtos/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dtos/update-category-request.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async createCategory(dto: CreateCategoryRequestDto) {
    return this.repository.createCategory({
      name: dto.name,
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
      menu: { connect: { id: dto.menuId } },
    });
  }

  async getCategory(id: string) {
    return this.repository.getCategory(id);
  }

  async getCategories(menuId: string) {
    return this.repository.getCategories(menuId);
  }

  async updateCategory(id: string, dto: UpdateCategoryRequestDto) {
    return this.repository.updateCategory(id, { ...dto });
  }

  async deleteCategory(id: string) {
    return this.repository.deleteCategory(id);
  }
}
