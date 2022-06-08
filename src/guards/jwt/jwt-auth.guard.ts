import { IS_PUBLIC_KEY } from '@/decorator/public.decorator';
import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/decorator/roles.decorator';
import { User, UserRole } from '@/modules/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_TOKEN } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject(CACHE_MANAGER)
  private cacheManage: Cache;

  private logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const rolesAllowed = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest<Request>();

      const token = request.cookies[JWT_TOKEN];

      const payload: { user: User; sessionId: string } =
        this.jwtService.verify(token);

      await this.verifySession(payload.user.id, payload.sessionId);

      if (rolesAllowed) {
        await this.checkUserRoleAccessibility(payload.user.role, rolesAllowed);
      }

      request.user = payload.user;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
    }
  }

  async verifySession(userId: string, sessionId: string) {
    const sessionIdInCache = await this.cacheManage.get(userId);
    if (sessionIdInCache !== sessionId) {
      throw new UnauthorizedException('Invalid session');
    }
  }

  async checkUserRoleAccessibility(
    userRole: UserRole,
    rolesAllowed: UserRole[],
  ) {
    if (!rolesAllowed.includes(userRole)) {
      throw new UnauthorizedException('Access forbidden');
    }
  }
}
