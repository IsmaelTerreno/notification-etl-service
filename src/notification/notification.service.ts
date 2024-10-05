import { Injectable, Logger } from '@nestjs/common';
import { StellarBlockchainService } from '../stellar-blockchain/stellar-blockchain.service';
import { RabbitMQService } from '../rabbit-mq/rabbitmq.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly stellarBlockchainService: StellarBlockchainService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

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
        transactionInfoStream.on('close', () => {
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
          // Send the transaction details to the RabbitMQ queue
        });
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed to get transactions - Details: ${error.message}`,
      );
      return error.message;
    }
  }
}
