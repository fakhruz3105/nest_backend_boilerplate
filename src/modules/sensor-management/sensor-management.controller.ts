import { User } from '@/decorator/user.decorator';
import { JwtAuthGuard } from '@/guards/jwt/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User as UserEntity } from '../user/user.entity';
import { NewSensorTypeDTO } from './dto/new-sensor-type.dto';
import { NewSensorDTO } from './dto/new-sensor.dto';
import { UpdateSensorTypeDTO } from './dto/update-sensor-type.dto';
import { UpdateSensorDTO } from './dto/update-sensor.dto';
import { SensorManagementService } from './sensor-management.service';

@UseGuards(JwtAuthGuard)
@Controller('sensor-management')
export class SensorManagementController {
  constructor(
    private readonly sensorManagementService: SensorManagementService,
  ) {}

  @Get('sensor/all')
  async listOfSensors() {
    return await this.sensorManagementService.listOfSensors();
  }

  @Get('type/all')
  async typeOfSensors() {
    return await this.sensorManagementService.listOfSensorTypes();
  }

  @Get('sensor/:id')
  async sensorDetails(@Param('id') id: string) {
    return await this.sensorManagementService.sensorDetails(id);
  }

  @Get('type/:id')
  async sensorTypeDetails(@Param('id') id: string) {
    return await this.sensorManagementService.sensorTypeDetails(id);
  }

  @Post('sensor')
  async registerNewSensor(
    @User() user: UserEntity,
    @Body() newSensor: NewSensorDTO,
  ) {
    return await this.sensorManagementService.registerNewSensor(
      user,
      newSensor,
    );
  }

  @Put('sensor')
  async updateSensor(@Body() sensor: UpdateSensorDTO) {
    return await this.sensorManagementService.updateSensor(sensor);
  }

  @Post('type')
  async newSensorType(@Body() newSensorType: NewSensorTypeDTO) {
    return await this.sensorManagementService.newSensorType(newSensorType);
  }

  @Put('type')
  async updateSensorType(@Body() updateSensorType: UpdateSensorTypeDTO) {
    return await this.sensorManagementService.updateSensorType(
      updateSensorType,
    );
  }
}
