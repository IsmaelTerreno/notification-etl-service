import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [NotificationModule, DatabaseModule, ConfigModule.forRoot(), HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
