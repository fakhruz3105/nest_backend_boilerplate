import { Public } from '@/decorator/public.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DataSummaryDTO } from './dto/data-summary.dto';
import { SensorDataDTO } from './dto/sensor-data.dto';
import { SensorGuard } from './sensor-data.guard';
import { SensorService } from './sensor-data.service';

@UseGuards(SensorGuard)
@Controller('sensor-data')
export class SensorController {
  constructor(private sensorService: SensorService) {}

  @Post('new')
  async dht11SensorEndpoint(@Body() body: SensorDataDTO) {
    await this.sensorService.saveNewData(body);
  }

  @Public()
  @Post('summary')
  async dataSummary(@Body() data: DataSummaryDTO) {
    const { sensorTypeId, startTimestamp, endTimestamp } = data;
    return await this.sensorService.dataSummary(
      sensorTypeId,
      startTimestamp,
      endTimestamp,
    );
  }
}
