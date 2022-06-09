import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateSensorTypeDTO {
  @IsUUID()
  public id: string;

  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  public dataCollected?: string[];

  @IsOptional()
  @IsNumber()
  public price?: number;
}
