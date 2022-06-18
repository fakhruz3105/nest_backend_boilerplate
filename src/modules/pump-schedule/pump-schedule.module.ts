import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PumpScheduleController } from './pump-schedule.controller';
import { PumpSchedule } from './pump-schedule.entity';
import { PumpScheduleService } from './pump-schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([PumpSchedule])],
  controllers: [PumpScheduleController],
  providers: [PumpScheduleService],
  exports: [PumpScheduleService],
})
export class PumpScheduleModule {}
