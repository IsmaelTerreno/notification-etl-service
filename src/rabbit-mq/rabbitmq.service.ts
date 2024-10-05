import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {Channel, connect, Connection} from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: Connection;
    private channel: Channel;

    async onModuleInit() {
        this.connection = await connect(process.env.RABBITMQ_CONNECTION_URL);
        this.channel = await this.connection.createChannel();
    }

    async onModuleDestroy() {
        await this.channel.close();
        await this.connection.close();
    }

    async sendToQueue(queue: string, message: object) {
        const buffer = Buffer.from(JSON.stringify(message));
        // Send the message to the queue deliver mode persistent
        return this.channel.sendToQueue(queue, buffer, {persistent: true});
    }
}
