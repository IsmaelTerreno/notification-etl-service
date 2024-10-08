import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbit-mq/rabbitmq.module';
import { StellarBlockchainModule } from '../stellar-blockchain/stellar-blockchain.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserRepository } from './user.repository';
import { SubscriptionRepository } from './notification.repository';
import { DatabaseModule } from '../database/database.module';
import { DecafApiModule } from '../decaf-api/decaf-api.module';
import { AccountRepository } from './account.repository';

/**
 * The module that contains all the notification related services and controllers as the heart for other modules.
 * This module is responsible for persisting the notifications and subscriptions in the database and sending notifications to the users via rabbitMQ for message delegation.
 */
@Module({
  imports: [
    RabbitMQModule,
    StellarBlockchainModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    DecafApiModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    UserRepository,
    AccountRepository,
    SubscriptionRepository,
  ],
})
export class NotificationModule {}
