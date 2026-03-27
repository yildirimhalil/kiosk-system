import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto) {
    const branch = await this.prisma.branch.findFirst({
      where: { code: dto.branchCode, deletedAt: null, isActive: true },
    });
    if (!branch) {
      throw new UnauthorizedException('Invalid branch or credentials');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        branchId: branch.id,
        loginName: dto.loginName,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid branch or credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      branchId: user.branchId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        branchId: user.branchId,
      },
    };
  }
}
