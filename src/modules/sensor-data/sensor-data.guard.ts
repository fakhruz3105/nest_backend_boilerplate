import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sensor } from '../sensor-management/sensor.entity';

@Injectable()
export class SensorGuard implements CanActivate {
  private logger = new Logger(SensorGuard.name);

  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const piKey = request.headers['authorization'];

    if (piKey !== this.config.get<string>('PI_SECRET_KEY')) {
      throw new UnauthorizedException('PI_SECRET_KEY not recognized');
    }

    await this.verifySensorId((request.body as any).sensorId);

    return true;
  }

  async verifySensorId(id: string) {
    const sensor = await Sensor.findOneBy({ id });

    if (!sensor) throw new UnauthorizedException('Sensor not registered');
  }
}
