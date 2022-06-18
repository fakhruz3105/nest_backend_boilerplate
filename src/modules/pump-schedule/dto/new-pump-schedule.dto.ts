import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class NewPumpScheduleDTO {
  @IsString()
  time: string;

  @IsOptional()
  @IsBoolean()
  repeatDaily?: boolean;
}
