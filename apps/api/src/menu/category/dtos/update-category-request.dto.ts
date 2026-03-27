import { IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateCategoryRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
