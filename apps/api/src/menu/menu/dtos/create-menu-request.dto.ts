import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateMenuRequestDto {
  @IsString()
  branchId: string;

  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
