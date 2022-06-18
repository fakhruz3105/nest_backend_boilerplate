import { IS_PUBLIC_KEY } from '@/decorator/public.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/decorator/roles.decorator';
import { User, UserRole } from '@/modules/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_TOKEN } from './constants';
import { AuthSession } from '@/modules/auth/auth-session.entity';
import { DateTime } from '@/common/helper/DateTime';

@Injectable()
export class JwtAuthGuard implements CanActivate {
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

    let sessionId = '';

    try {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      const token = request.cookies[JWT_TOKEN];

      const payload: { user: User; sessionId: string; exp: number } =
        this.jwtService.verify(token);

      sessionId = payload.sessionId;

      await this.verifySession(payload.user.id, payload.sessionId);

      if (rolesAllowed) {
        await this.checkUserRoleAccessibility(payload.user.role, rolesAllowed);
      }

      const tokenExpirationTime = new DateTime(payload.exp * 1000);
      const currentTime = new DateTime();

      // Refresh token if its about to expire
      if (tokenExpirationTime.difference(currentTime, 'minute') < 1) {
        const { user, sessionId } = payload;
        const newToken = this.jwtService.sign({ user, sessionId });
        response.cookie('JWT_TOKEN', newToken);
      }

      request.user = payload.user;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        if (sessionId) await AuthSession.delete({ id: sessionId });
        throw new UnauthorizedException('Token expired');
      }
    }
  }

  async verifySession(userId: string, sessionId: string) {
    const session = await AuthSession.findOneBy({ id: sessionId, userId });
    if (!session) {
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
