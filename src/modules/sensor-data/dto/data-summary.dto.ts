import { IsString } from 'class-validator';

export class DataSummaryDTO {
  @IsString()
  sensorTypeId: string;

  @IsString()
  summaryRange: 'weekly' | 'monthly' | 'yearly';
}
