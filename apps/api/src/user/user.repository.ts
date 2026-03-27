import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, UserRole } from '@prisma/client';

const userPublicSelect = {
  id: true,
  branchId: true,
  name: true,
  loginName: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserPublic = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByIdInBranch(
    id: string,
    branchId: string,
  ): Promise<UserPublic | null> {
    return this.prisma.user.findFirst({
      where: { id, branchId, deletedAt: null },
      select: userPublicSelect,
    });
  }

  async findManyByBranch(branchId: string): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      where: { branchId, deletedAt: null },
      select: userPublicSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    branchId: string,
    data: {
      name: string;
      loginName: string;
      passwordHash: string;
      role: UserRole;
      isActive: boolean;
    },
  ): Promise<UserPublic> {
    return this.prisma.user.create({
      data: {
        branch: { connect: { id: branchId } },
        name: data.name,
        loginName: data.loginName,
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
      select: userPublicSelect,
    });
  }

  async update(
    id: string,
    branchId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserPublic> {
    const result = await this.prisma.user.updateMany({
      where: { id, branchId, deletedAt: null },
      data,
    });
    if (result.count === 0) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.findFirstOrThrow({
      where: { id, branchId },
      select: userPublicSelect,
    });
  }

  async softDelete(id: string, branchId: string): Promise<UserPublic> {
    const existing = await this.prisma.user.findFirst({
      where: { id, branchId, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: userPublicSelect,
    });
  }
}
