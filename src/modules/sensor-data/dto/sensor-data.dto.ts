import { IsBoolean, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class SensorDataDTO {
  @IsUUID()
  sensorId: string;

  @IsBoolean()
  condition: boolean;

  @IsNumber()
  timestamp: number;

  @IsOptional()
  data?: Record<string, any>;
}
