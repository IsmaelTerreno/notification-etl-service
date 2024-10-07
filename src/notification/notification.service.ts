import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StellarBlockchainService } from '../stellar-blockchain/stellar-blockchain.service';
import { RabbitMQService } from '../rabbit-mq/rabbitmq.service';
import { MessageMqDto } from '../rabbit-mq/message-mq.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SUBSCRIPTION_REPOSITORY } from './notification.repository';
import { Subscription } from './subscription.entity';
import { In, Repository } from 'typeorm';
import { USER_REPOSITORY } from './user.repository';
import { User } from './user.entity';
import { DecafApiService } from '../decaf-api/decaf-api.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private subscriptionPayments: Subscription;

  constructor(
    private readonly stellarBlockchainService: StellarBlockchainService,
    private readonly rabbitMQService: RabbitMQService,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private subscriptionRepository: Repository<Subscription>,
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
    private decafApiService: DecafApiService,
  ) {}

  async onModuleInit() {
    // Find the default subscription for payments if it exists
    this.subscriptionPayments = await this.subscriptionRepository.findOne({
      where: { name: 'Payments' },
    });
    if (!this.subscriptionPayments) {
      // Register the default subscription for payments
      const subscriptionPaymentsToRegister = new Subscription();
      subscriptionPaymentsToRegister.name = 'Payments';
      this.subscriptionPayments = await this.subscriptionRepository.save(
        subscriptionPaymentsToRegister,
      );
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async importUsersProcess() {
    const callbackFn = async (response) => {
      this.logger.log('🚚 Received users from Decaf API...');
      const users = response.data;
      this.logger.log(`👥 Total users received: ${users.length}`);
      this.logger.log('🏁 End of users stream');
      await this.processUsers(users);
    };
    this.decafApiService.importUsers(callbackFn);
  }

  async processUsers(users: any) {
    const hasUsers = users && users.length > 0;
    // Check if there are users to import
    if (hasUsers) {
      for (const user of users) {
        // Find the user in the database by userId
        const userExists = await this.userRepository.findOne({
          where: { userId: user.id },
        });
        // Log the user information to import for new or existing user
        const infoToLog = userExists ? '🔄 Updating user' : '🆕 Creating user';
        this.logger.log(
          infoToLog +
            ' with userId: ' +
            user.id +
            ' and username: ' +
            user.username,
        );
        // Create a new user if it does not exist
        const userInfoToPersist = userExists ? userExists : new User();
        // Collect the user information to persist
        userInfoToPersist.userId = user.id;
        userInfoToPersist.username = user.username;
        userInfoToPersist.name = user.name;
        userInfoToPersist.email = user.email;
        userInfoToPersist.photoUrl = user.photoUrl;
        // Assign the subscription for payments.
        // Note: This is a default subscription for payments and can be changed later
        userInfoToPersist.subscription = this.subscriptionPayments;
        await this.userRepository.save(userInfoToPersist);
        this.logger.log(
          '🆗 User info imported to database with userId: ' +
            user.id +
            ' and username: ' +
            user.username,
        );
      }
    }
  }

  //@Cron(CronExpression.EVERY_10_SECONDS)
  async getTransactionsForPaymentsUpdates() {
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
          // Parse the transaction details to JSON to get the transaction info
          const transactionDetails =
            this.parseStellarTransaction(transactionInfo);
          this.logger.log(
            `📦 Total transaction received: ${transactionDetails.length}`,
          );
          this.logger.log('🏁 End of transaction info stream');
          await this.processTransactionDetails(transactionDetails);
        });
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed to get transactions - Details: ${error.message}`,
      );
      return error.message;
    }
  }

  async processTransactionDetails(transactionDetails: any) {
    // Get the user ids from the transaction details
    const userIds = transactionDetails.map((transaction) => transaction.id);
    // Find the users to notify
    const usersToNotify = await this.findUsersToNotify(userIds);
    // Log the users to notify
    this.logger.log(
      `👥 Users to notify: ${usersToNotify.map((user) => user.id).join(', ')}`,
    );

    // Loop through the transaction details
    for (const transactionX of transactionDetails) {
      this.logger.log('🚀 Sending transaction details to RabbitMQ...');
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
  }

  findUsersToNotify(userIds: string[]): Promise<User[]> {
    return this.userRepository.findBy({ id: In(userIds) });
  }

  parseStellarTransaction(streamedText: string) {
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
  }

  async createMessageMQService(messageMqDto: MessageMqDto) {
    // Send the message to the RabbitMQ queue to delegate the async message processing by the consumers
    await this.rabbitMQService.sendToQueue(
      messageMqDto.queueName,
      messageMqDto.messageDetail,
    );
  }
}
