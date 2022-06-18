import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { GlobalModule } from '@/global.module';
import { SensorDataModule } from '@/modules/sensor-data/sensor-data.module';
import { SensorManagementModule } from '@/modules/sensor-management/sensor-management.module';
import { PumpScheduleModule } from '@/modules/pump-schedule/pump-schedule.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UserModule,
    SensorDataModule,
    SensorManagementModule,
    PumpScheduleModule,
  ],
})
export class AppModule {}
