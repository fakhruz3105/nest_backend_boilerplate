import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { GlobalModule } from '@/global.module';
import { SensorModule } from '@/modules/sensor-data/sensor-data.module';

@Module({
  imports: [GlobalModule, AuthModule, UserModule, SensorModule],
})
export class AppModule {}
