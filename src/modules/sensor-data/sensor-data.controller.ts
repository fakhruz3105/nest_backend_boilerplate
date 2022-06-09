import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SensorDataDTO } from './dto/sensor-data.dto';
import { SensorGuard } from './sensor-data.guard';
import { SensorService } from './sensor-data.service';

@UseGuards(SensorGuard)
@Controller('sensor-data')
export class SensorController {
  constructor(private sensorService: SensorService) {}

  @Post('/new')
  async dht11SensorEndpoint(@Body() body: SensorDataDTO) {
    await this.sensorService.saveNewData(body);
  }
}
