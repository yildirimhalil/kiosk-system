import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductRequestDto } from './dtos/create-product-request.dto';
import { UpdateProductRequestDto } from './dtos/update-product-response.dto';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async createProduct(dto: CreateProductRequestDto) {
    return this.repository.createProduct({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
      isAvailable: dto.isAvailable,
      category: { connect: { id: dto.categoryId } },
    });
  }

  async getProduct(id: string) {
    return this.repository.getProduct(id);
  }

  async getProducts(categoryId: string) {
    return this.repository.getProducts(categoryId);
  }

  async updateProduct(id: string, dto: UpdateProductRequestDto) {
    return this.repository.updateProduct(id, { ...dto });
  }

  async deleteProduct(id: string) {
    return this.repository.deleteProduct(id);
  }
}
