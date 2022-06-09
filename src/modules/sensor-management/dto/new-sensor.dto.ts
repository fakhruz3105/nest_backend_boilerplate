import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class NewSensorDTO {
  @IsLatitude()
  public latitude: number;

  @IsLongitude()
  public longitude: number;

  @IsString()
  @IsNotEmpty()
  public sensorTypeId: string;
}
