import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  branchId: string;
  role: UserRole;
}
