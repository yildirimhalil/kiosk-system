import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { AuthUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UpdateUserRequestDto } from './dtos/update-user-request.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(
    @CurrentUser() currentUser: AuthUser,
    @Query('branchId') branchId?: string,
  ) {
    return this.userService.getUsers(currentUser, branchId);
  }

  @Get(':id')
  getUser(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.userService.getUser(currentUser, id);
  }

  @Post()
  createUser(
    @CurrentUser() currentUser: AuthUser,
    @Body() dto: CreateUserRequestDto,
  ) {
    return this.userService.createUser(currentUser, dto);
  }

  @Put(':id')
  updateUser(
    @CurrentUser() currentUser: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto,
  ) {
    return this.userService.updateUser(currentUser, id, dto);
  }

  @Delete(':id')
  deleteUser(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.userService.deleteUser(currentUser, id);
  }
}
