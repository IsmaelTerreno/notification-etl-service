import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
/**
 * The module that contains all the rabbitMQ related services.
 * This module is responsible for sending messages to the rabbitMQ server.
 */
export class RabbitMQModule {}
