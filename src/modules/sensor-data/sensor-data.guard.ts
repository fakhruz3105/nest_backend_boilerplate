import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const PI_KEY = 'pi_key';

@Injectable()
export class SensorGuard implements CanActivate {
  private logger = new Logger(SensorGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const piKey = request.headers[PI_KEY];

    if (piKey !== this.config.get<string>('PI_KEY')) {
      throw new UnauthorizedException('PI_KEY not recognized');
    }

    return true;
  }
}
