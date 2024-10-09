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
import { Account } from './account.entity';
import { ACCOUNT_REPOSITORY } from './account.repository';
import { UsersInfoDecafDto } from '../decaf-api/users-info-decaf.dto';
import { EventNotificationMessageDto } from './event-notification-message.dto';
import * as process from 'node:process';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private subscriptionPayments: Subscription;

  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
    @Inject(ACCOUNT_REPOSITORY)
    private accountRepository: Repository<Account>,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private subscriptionRepository: Repository<Subscription>,
    private readonly stellarBlockchainService: StellarBlockchainService,
    private readonly rabbitMQService: RabbitMQService,
    private decafApiService: DecafApiService,
  ) {}

  /**
   * Initializes the module by setting up the default subscription for payments.
   *
   * This method attempts to find an existing subscription named 'Payments'.
   * If such a subscription does not exist, it registers a new one.
   *
   * @return {Promise<void>} A promise that resolves when the initialization process is complete.
   */
  async onModuleInit() {
    // Find the default subscription for payments if it exists
    this.subscriptionPayments = await this.subscriptionRepository.findOne({
      where: { name: 'Payments' },
    });
    if (!this.subscriptionPayments) {
      // Register the default subscription for payments
      // Note: This is a default subscription for payments and can be changed later
      const subscriptionPaymentsToRegister = new Subscription();
      subscriptionPaymentsToRegister.name = 'Payments';
      this.subscriptionPayments = await this.subscriptionRepository.save(
        subscriptionPaymentsToRegister,
      );
    }
  }

  /**
   * Periodically imports users from the Decaf API every 5 seconds.
   * The imported users are processed using the `processUsers` method.
   * Logs the number of users received and indicates the end of the user stream.
   *
   * @return {Promise<void>}
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async importUsersProcess() {
    const callbackFn = async (response) => {
      this.logger.log('🚚 Received users from Decaf API...');
      const users: UsersInfoDecafDto[] = response.data;
      this.logger.log(`👥 Total users received: ${users.length}`);
      this.logger.log('🏁 End of users stream');
      await this.processUsers(users);
    };
    this.decafApiService.importUsers(callbackFn);
  }

  /**
   * Imports or updates a list of users and their associated accounts into the database.
   *
   * @param {UsersInfoDecafDto[]} users - The array of user information to be processed.
   * @return {Promise<void>} A promise that resolves when the processing is complete.
   */
  async processUsers(users: UsersInfoDecafDto[]) {
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
        const accountInfoUpdated: Account[] = [];
        // Collect the user accounts information to persist
        for (const account of user.accountInfos) {
          // Find the account in the database by publicKey
          const accountExists = await this.accountRepository.findOne({
            where: { publicKey: account.publicKey },
          });
          // Create a new account if it does not exist
          const accountInfoToPersist = accountExists
            ? accountExists
            : new Account();
          accountInfoToPersist.publicKey = account.publicKey;
          accountInfoToPersist.index = account.index;
          accountInfoToPersist.chain = account.chain;
          accountInfoToPersist.isActivated = account.isActivated;
          accountInfoToPersist.isPrivate = account.isPrivate;
          // Assign the account info to the user
          accountInfoToPersist.user = userInfoToPersist;
          accountInfoUpdated.push(accountInfoToPersist);
        }
        // Assign the account info to the user
        userInfoToPersist.accounts = accountInfoUpdated;
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

  /**
   * Schedules a task to retrieve and process transactions from the Stellar blockchain every 10 seconds.
   *
   * This method utilizes the Stellar Blockchain Service to fetch transactions,
   * processes the incoming data stream to parse transaction details,
   * and calls an internal method to handle notification for existing users based on the transactions.
   *
   * @return {Promise<string | void>} A promise that resolves with an error message if the process fails, or void if successful.
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
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
          await this.processTransactionsForExistingUsersToNotify(
            transactionDetails,
          );
        });
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed to get transactions - Details: ${error.message}`,
      );
      return error.message;
    }
  }

  /**
   * Processes transactions for existing users and sends necessary notifications.
   *
   * @param {Array} transactionDetails - An array containing transaction details.
   * @return {Promise<void>} A promise that resolves when the processing is complete.
   */
  async processTransactionsForExistingUsersToNotify(transactionDetails: any) {
    // Get the user accounts from the transaction details
    const userAccounts = transactionDetails.map(
      (transaction) => transaction.source_account,
    );
    // Find the users to notify
    const usersToNotify = await this.findUsersToNotify(userAccounts);
    // Check if there are users to notify
    if (!usersToNotify || usersToNotify.length === 0) {
      this.logger.log('🚫 No users found to notify');
      return;
    }
    // Log the users to notify
    this.logger.log(
      `👥 Users to notify: ${usersToNotify.map((user) => user.id).join(', ')}`,
    );
    // Loop through the transaction details
    for (const transactionX of transactionDetails) {
      // Event message to send to the RabbitMQ queue
      const eventMessage: EventNotificationMessageDto = {
        userIds: usersToNotify.map((user) => user.userId),
        notification: {
          title: 'Transaction Notification',
          body: 'You have received a new transaction',
          data: {
            source_account: transactionX.source_account,
            hash: transactionX.hash,
            created_at: transactionX.created_at,
          },
        },
      };
      this.logger.log('🚀 Sending transaction details to RabbitMQ...');
      // Send the transaction details to the RabbitMQ queue to delegate the async message processing
      await this.createMessageMQService({
        queueName: process.env.RABBITMQ_QUEUE_NAME,
        messageDetail: {
          pattern: 'notification-to-send',
          data: eventMessage,
        },
      });
    }
  }

  /**
   * Finds and returns a list of users that need to be notified based on given user accounts.
   *
   * @param {string[]} userAccounts - Array of user account public keys to find the users to notify.
   * @return {Promise<User[]>} A promise that resolves to an array of User objects to be notified.
   */
  findUsersToNotify(userAccounts: string[]): Promise<User[]> {
    // Find the users to notify by the user accounts
    return this.userRepository.find({
      where: {
        accounts: {
          publicKey: In(userAccounts),
        },
      },
    });
  }

  /**
   * Parses a streamed Stellar transaction text and extracts transaction details.
   *
   * @param {string} streamedText - The streamed text containing raw transaction data.
   * @return {Array<Object>} - An array of parsed transaction detail objects.
   */
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

  /**
   * Sends a message to the RabbitMQ queue for asynchronous processing by consumers.
   *
   * @param {MessageMqDto} messageMqDto - The data transfer object containing the queue name and message details.
   * @return {Promise<void>} A promise that resolves when the message has been successfully sent to the queue.
   */
  async createMessageMQService(messageMqDto: MessageMqDto) {
    // Send the message to the RabbitMQ queue to delegate the async message processing by the consumers
    await this.rabbitMQService.sendToQueue(
      messageMqDto.queueName,
      messageMqDto.messageDetail,
    );
  }
}
