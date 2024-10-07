import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
})
/**
 * The HealthModule is a feature module that encapsulates the health check feature for dependency health checks.
 */
export class HealthModule {}
