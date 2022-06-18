import { Module } from '@nestjs/common';
import { SensorData } from './sensor-data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorDataController } from './sensor-data.controller';
import { SensorDataService } from './sensor-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])],
  controllers: [SensorDataController],
  providers: [SensorDataService],
  exports: [SensorDataService],
})
export class SensorDataModule {}
