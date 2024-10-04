import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbit-mq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
