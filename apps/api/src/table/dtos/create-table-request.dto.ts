import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TableStatus } from '@prisma/client';

export class CreateTableRequestDto {
  @IsString()
  branchId: string;

  @IsString()
  number: string;

  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}
