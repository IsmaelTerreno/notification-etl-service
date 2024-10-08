import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Channel, connect, Connection } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  /**
   * Initializes the module by establishing a connection to RabbitMQ using
   * the connection URL specified in the environment variables.
   *
   * @return {Promise<void>} A promise that resolves when the connection and channel are successfully created.
   */
  async onModuleInit() {
    this.connection = await connect(process.env.RABBITMQ_CONNECTION_URL);
    this.channel = await this.connection.createChannel();
  }

  /**
   * Handles cleanup tasks when a module is destroyed.
   * This method closes the channel and the connection.
   *
   * @return {Promise<void>} A promise that resolves when the channel and connection are closed.
   */
  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  /**
   * Sends a given message to a specified queue.
   *
   * @param {string} queue - The name of the queue to which the message will be sent.
   * @param {Object} message - The message object to be sent to the queue.
   * @return {boolean} - Returns true if the message is successfully sent to the queue.
   */
  async sendToQueue(queue: string, message: object) {
    const buffer = Buffer.from(JSON.stringify(message));
    // Send the message to the queue deliver mode persistent
    return this.channel.sendToQueue(queue, buffer, { persistent: true });
  }
}
