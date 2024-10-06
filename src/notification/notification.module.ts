import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbit-mq/rabbitmq.module';
import { StellarBlockchainModule } from '../stellar-blockchain/stellar-blockchain.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [RabbitMQModule, StellarBlockchainModule, ScheduleModule.forRoot()],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {
}
