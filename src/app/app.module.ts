import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '../health/health.module';

/**
 * AppModule serves as the root module for the application.
 * It imports other necessary modules required for the application,
 * including NotificationModule for handling notifications,
 * ConfigModule for managing environment configurations,
 * and HealthModule for monitoring application health.
 */
@Module({
  imports: [NotificationModule, ConfigModule.forRoot(), HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
