import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePumpScheduleDTO {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsBoolean()
  repeatDaily?: boolean;
}
