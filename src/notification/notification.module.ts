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
