import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorManagementController } from './sensor-management.controller';
import { SensorManagementService } from './sensor-management.service';
import { SensorType } from './sensor-type.entity';
import { Sensor } from './sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorType])],
  controllers: [SensorManagementController],
  providers: [SensorManagementService],
  exports: [SensorManagementService],
})
export class SensorManagementModule {}
