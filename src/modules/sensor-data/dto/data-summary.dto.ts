import { IsString, IsNumber } from 'class-validator';

export class DataSummaryDTO {
  @IsString()
  sensorTypeId: string;

  @IsNumber()
  startTimestamp: number;

  @IsNumber()
  endTimestamp: number;
}
