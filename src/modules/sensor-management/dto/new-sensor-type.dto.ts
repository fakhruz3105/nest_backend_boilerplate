import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewSensorTypeDTO {
  @IsString()
  public name: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  public dataCollected: string[];

  @IsOptional()
  @IsNumber()
  public price?: number;
}
