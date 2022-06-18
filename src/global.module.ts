import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from '@/common/helper/env.helper';
import { jwtConstants } from '@/guards/jwt/constants';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from '@/modules/notification/notification.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ScheduleModule.forRoot(),
    CacheModule.register(),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
    NotificationModule,
  ],
  exports: [
    ConfigModule,
    TypeOrmModule,
    CacheModule,
    JwtModule,
    NotificationModule,
    ScheduleModule,
  ],
})
export class GlobalModule {}
