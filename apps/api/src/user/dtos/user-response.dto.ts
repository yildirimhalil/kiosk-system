import { IsString, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  branchId: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  createdAt: Date;
}
