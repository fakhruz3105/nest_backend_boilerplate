import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewSensorDTO {
  @IsNumber()
  public latitude: number;

  @IsNumber()
  public longitude: number;

  @IsString()
  @IsNotEmpty()
  public sensorTypeId: string;
}
