import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbit-mq/rabbitmq.module';
import { StellarBlockchainModule } from '../stellar-blockchain/stellar-blockchain.module';

@Module({
  imports: [RabbitMQModule, StellarBlockchainModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
