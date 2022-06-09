import { IsLatitude, IsLongitude, IsOptional, IsUUID } from 'class-validator';

export class UpdateSensorDTO {
  @IsUUID()
  public id: string;

  @IsOptional()
  @IsLatitude()
  public latitude: number;

  @IsOptional()
  @IsLongitude()
  public longitude: number;
}
