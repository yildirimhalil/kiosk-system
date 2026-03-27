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
import { ProductService } from './product.service';
import { CreateProductRequestDto } from './dtos/create-product-request.dto';
import { UpdateProductRequestDto } from './dtos/update-product-response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductRequestDto) {
    return this.service.createProduct(dto);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.service.getProduct(id);
  }

  @Get()
  async getProducts(@Query('categoryId') categoryId: string) {
    return this.service.getProducts(categoryId);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
  ) {
    return this.service.updateProduct(id, dto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.service.deleteProduct(id);
  }
}
