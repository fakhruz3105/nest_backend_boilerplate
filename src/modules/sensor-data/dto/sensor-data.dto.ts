import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class SensorDataDTO {
  @IsString()
  sensorId: string;

  @IsBoolean()
  condition: boolean;

  @IsOptional()
  data?: Record<string, any>;
}
