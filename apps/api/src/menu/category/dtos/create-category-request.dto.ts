import { IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCategoryRequestDto {
  @IsString()
  menuId: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  sortOrder: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
