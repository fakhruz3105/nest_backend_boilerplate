import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class SensorDataDTO {
  @IsString()
  sensorId: string;

  @IsBoolean()
  condition: boolean;

  @IsNumber()
  timestamp: number;

  @IsOptional()
  data?: Record<string, any>;
}
