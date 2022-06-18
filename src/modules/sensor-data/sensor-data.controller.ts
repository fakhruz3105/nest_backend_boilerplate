import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DataSummaryDTO } from './dto/data-summary.dto';
import { SensorDataDTO } from './dto/sensor-data.dto';
import { SensorGuard } from './sensor-data.guard';
import { SensorDataService } from './sensor-data.service';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private sensorService: SensorDataService) {}

  @UseGuards(SensorGuard)
  @Post('new')
  async dht11SensorEndpoint(@Body() body: SensorDataDTO) {
    await this.sensorService.saveNewData(body);
  }

  @Get(':sensorTypeId/:from/:to')
  async getDataList(
    @Param('sensorTypeId') sensorTypeId: string,
    @Param('from') from: number,
    @Param('to') to: number,
  ) {
    return await this.sensorService.getDataList(sensorTypeId, from, to);
  }

  @Post('summary')
  async dataSummary(@Body() data: DataSummaryDTO) {
    const { sensorTypeId, summaryRange } = data;
    return await this.sensorService.dataSummary(sensorTypeId, summaryRange);
  }
}
