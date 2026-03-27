import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TableStatus } from '@prisma/client';

export class UpdateTableRequestDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}
