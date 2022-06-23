import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateSensorDTO {
  @IsUUID()
  public id: string;

  @IsOptional()
  @IsNumber()
  public latitude: number;

  @IsOptional()
  @IsNumber()
  public longitude: number;
}
