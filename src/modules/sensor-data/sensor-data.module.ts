import { Module } from '@nestjs/common';
import { SensorData } from './sensor-data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorController } from './sensor-data.controller';
import { SensorService } from './sensor-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])],
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService],
})
export class SensorModule {}
