import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthUser } from 'src/common/decorators/current-user.decorator';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUsers(currentUser: AuthUser, branchId?: string) {
    const bid = branchId ?? currentUser.branchId;
    this.ensureSameBranch(currentUser, bid);
    return this.repository.findManyByBranch(bid);
  }

  async getUser(currentUser: AuthUser, id: string) {
    const user = await this.repository.findByIdInBranch(
      id,
      currentUser.branchId,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(currentUser: AuthUser, dto: CreateUserRequestDto) {
    this.requireAdmin(currentUser);
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.repository.create(currentUser.branchId, {
      name: dto.name,
      loginName: dto.loginName,
      passwordHash,
      role: dto.role,
      isActive: dto.isActive ?? true,
    });
  }

  async updateUser(
    currentUser: AuthUser,
    id: string,
    dto: UpdateUserRequestDto,
  ) {
    this.requireAdmin(currentUser);
    const existing = await this.repository.findByIdInBranch(
      id,
      currentUser.branchId,
    );
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    const data: Parameters<UserRepository['update']>[2] = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    return this.repository.update(id, currentUser.branchId, data);
  }

  async deleteUser(currentUser: AuthUser, id: string) {
    this.requireAdmin(currentUser);
    return this.repository.softDelete(id, currentUser.branchId);
  }

  private requireAdmin(user: AuthUser) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin role required');
    }
  }

  private ensureSameBranch(currentUser: AuthUser, branchId: string) {
    if (branchId !== currentUser.branchId) {
      throw new ForbiddenException('Cannot access another branch');
    }
  }
}
