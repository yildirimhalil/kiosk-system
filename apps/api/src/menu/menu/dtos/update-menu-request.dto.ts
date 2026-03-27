import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMenuRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
