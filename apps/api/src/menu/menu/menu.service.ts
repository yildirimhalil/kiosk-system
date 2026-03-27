import { Injectable } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { CreateMenuRequestDto } from './dtos/create-menu-request.dto';
import { UpdateMenuRequestDto } from './dtos/update-menu-request.dto';

@Injectable()
export class MenuService {
  constructor(private readonly repository: MenuRepository) {}

  async createMenu(dto: CreateMenuRequestDto) {
    return this.repository.createMenu({
      name: dto.name,
      isActive: dto.isActive,
      branch: { connect: { id: dto.branchId } },
    });
  }

  async getMenu(id: string) {
    return this.repository.getMenu(id);
  }

  async getMenus(branchId: string) {
    return this.repository.getMenus(branchId);
  }

  async updateMenu(id: string, dto: UpdateMenuRequestDto) {
    return this.repository.updateMenu(id, { ...dto });
  }

  async deleteMenu(id: string) {
    return this.repository.deleteMenu(id);
  }
}
