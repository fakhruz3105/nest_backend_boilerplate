import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateSensorDTO {
  @IsUUID()
  public id: string;

  @IsOptional()
  @IsBoolean()
  public condition?: boolean;

  @IsOptional()
  @IsNumber()
  public latitude?: number;

  @IsOptional()
  @IsNumber()
  public longitude?: number;
}
