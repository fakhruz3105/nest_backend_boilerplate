import { Public } from '@/decorator/public.decorator';
import { Roles } from '@/decorator/roles.decorator';
import { User } from '@/decorator/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { VerifyUserDTO } from './dto/verify-user.dto';
import { User as UserEntity, UserRole } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @Get('all')
  async allUsers() {
    return await this.userService.getAllUsers();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Get(':id')
  async userDetails(@Param('id') id: string) {
    return await this.userService.getUserDetails(id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  async create(@Body() newUser: CreateUserDTO) {
    return await this.userService.createUser(newUser);
  }

  @Put()
  async update(@User() user: UserEntity, @Body() updateDetails: UpdateUserDTO) {
    return await this.userService.updateUser(user, updateDetails);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  async delete(@User() user: UserEntity, @Param('id') id: string) {
    return await this.userService.deleteUser(user, id);
  }

  @Public()
  @Post('verification')
  async userVerification(@Body() verifyUser: VerifyUserDTO) {
    await this.userService.userVerification(verifyUser.id, verifyUser.password);
  }
}
