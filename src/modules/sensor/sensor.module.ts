import { Module } from '@nestjs/common';
import { Sensor } from './sensor.entity';
import { SensorData } from './sensor-data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorData])],
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService],
})
export class SensorModule {}
