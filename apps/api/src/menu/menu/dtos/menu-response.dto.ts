import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class MenuResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
