import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [NotificationModule, ConfigModule.forRoot(), HealthModule],
  controllers: [],
  providers: [],
})
/**
 * The main module that contains all the other modules.
 * This module is responsible for importing all the other modules and starting the application.
 */
export class AppModule {}
