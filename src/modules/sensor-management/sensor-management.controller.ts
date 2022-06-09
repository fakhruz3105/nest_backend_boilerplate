import { JwtAuthGuard } from '@/guards/jwt/jwt-auth.guard';
import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { SensorManagementService } from './sensor-management.service';
import { Sensor } from './sensor.entity';

@UseGuards(JwtAuthGuard)
@Controller('sensor-management')
export class SensorManagementController {
  constructor(
    private readonly sensorManagementService: SensorManagementService,
  ) {}

  @Get('/all')
  async getListOfSensors() {}

  @Get(':id')
  async getSensorDetails() {}

  @Post()
  async registerNewSensor() {}

  @Put()
  async updateSensor() {}

  @Delete()
  async removeSensor() {}
}
