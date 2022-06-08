import { Public } from '@/decorator/public.decorator';
import { Roles } from '@/decorator/roles.decorator';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
} from '@nestjs/common';
import { User as UserEntity, UserRole } from '../user/user.entity';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';
import { JWT_TOKEN } from '@/guards/jwt/constants';
import { JwtAuthGuard } from '@/guards/jwt/jwt-auth.guard';
import { User } from '@/decorator/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDetails: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.login(loginDetails);
    response.cookie(JWT_TOKEN, token, {
      httpOnly: true,
      secure: true,
    });
    return user;
  }

  @Post('logout')
  async logout(
    @User() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.id);
    response.clearCookie(JWT_TOKEN);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Get('profile')
  getProfile(@Request() req) {
    return;
  }
}
