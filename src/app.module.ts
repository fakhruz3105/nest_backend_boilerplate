import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { GlobalModule } from './global.module';

@Module({
  imports: [GlobalModule, AuthModule, UserModule],
})
export class AppModule {}
