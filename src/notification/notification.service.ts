import { Injectable, Logger } from '@nestjs/common';
import { StellarBlockchainService } from '../stellar-blockchain/stellar-blockchain.service';
import { RabbitMQService } from '../rabbit-mq/rabbitmq.service';
import { MessageMqDto } from '../rabbit-mq/message-mq.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly stellarBlockchainService: StellarBlockchainService,
    private readonly rabbitMQService: RabbitMQService,
  ) {
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  getTransactions() {
    try {
      return this.stellarBlockchainService.getTransactions((responseStream) => {
        let transactionInfo = '';
        this.logger.log('🚚 Received transaction from Stellar blockchain...');
        // Get the response stream object
        const transactionInfoStream = responseStream.data;
        // Accumulate the chunk response from IncomingMessage object stream
        transactionInfoStream.on('data', (chunk) => {
          // Append the chunk to the transaction info
          transactionInfo += chunk.toString();
          // Log the chunk with loading icon message logger
          this.logger.log('🔄 Loading transaction info...');
        });

        // Handle the end of the response stream
        transactionInfoStream.on('close', async () => {
          const parseStellarTransaction = (streamedText: string) => {
            // Prefix to identify the transaction details
            const DATA_PREFIX_FILTER = 'data: {';
            const DATA_PREFIX_CLEAN_UP = 'data: ';
            // Parse the streamed text to get the transaction details
            const transactionDetails = streamedText.split('\n');
            return (
              transactionDetails
                // Filter the transaction details
                .filter((line) => line.indexOf(DATA_PREFIX_FILTER) >= 0)
                // Clean up the prefix
                .map((line) => line.replace(DATA_PREFIX_CLEAN_UP, ''))
                // Parse the JSON string to object
                .map((line) => JSON.parse(line))
            );
          };
          // Parse the transaction details to JSON to get the transaction info
          const transactionDetails = parseStellarTransaction(transactionInfo);
          this.logger.log(
            '📦 Last transaction details info:',
            transactionDetails,
          );
          this.logger.log('🏁 End of transaction info stream');
          for (const transactionX of transactionDetails) {
            // Send the transaction details to the RabbitMQ queue to delegate the async message processing
            await this.createMessageMQService({
              queueName: 'notification-service',
              messageDetail: {
                pattern: 'notification-to-send',
                data: {
                  source_account: transactionX.source_account,
                  hash: transactionX.hash,
                  created_at: transactionX.created_at,
                },
              },
            });
          }
        });
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed to get transactions - Details: ${error.message}`,
      );
      return error.message;
    }
  }

  findExistingUsersToNotify() {

  }


  async createMessageMQService(messageMqDto: MessageMqDto) {
    await this.rabbitMQService.sendToQueue(
      messageMqDto.queueName,
      messageMqDto.messageDetail,
    );
  }

}
