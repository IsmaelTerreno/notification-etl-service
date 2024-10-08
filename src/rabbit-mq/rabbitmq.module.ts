import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

/**
 * The module that contains all the rabbitMQ related services.
 * This module is responsible for sending messages to the rabbitMQ server.
 */
@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
