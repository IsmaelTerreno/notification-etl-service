import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StellarBlockchainService {
  private readonly logger = new Logger(StellarBlockchainService.name);
  /**
   * The base URL for the Stellar network server.
   *
   * This variable is configured using the STELLAR_BASE_SERVER_URL
   * environment variable. It is used to define the endpoint for
   * connecting to the Stellar network server.
   *
   * Example: 'https://horizon.stellar.org'
   *
   * @type {string}
   */
  private readonly baseUrlStellar = process.env.STELLAR_BASE_SERVER_URL;

  /**
   * Represents the endpoint URL for Stellar transaction processing.
   *
   * This value is fetched from the environment variable STELLAR_TRANSACTION_ENDPOINT.
   * It specifies the endpoint that the application should use to interact with the Stellar network for submitting and querying transactions.
   *
   * Ensure that the environment variable STELLAR_TRANSACTION_ENDPOINT is set before running the application.
   *
   * @type {string}
   */
  private readonly transactionEndpointStellar =
    process.env.STELLAR_TRANSACTION_ENDPOINT;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetches transactions from Stellar blockchain
   * @param callbackFn
   */
  getTransactions(callbackFn) {
    this.logger.log('🛰 Fetching transactions from Stellar blockchain...');
    this.httpService
      .get(this.baseUrlStellar + this.transactionEndpointStellar, {
        responseType: 'stream',
        maxBodyLength: Infinity,
        headers: {
          Accept: 'text/event-stream',
        },
      })
      .subscribe({
        next: (response) => {
          callbackFn(response);
        },
        error: (error) => {
          this.logger.error(
            `❌ Failed to get transactions - Details: ${error.message}`,
          );
          return error.message;
        },
      });
  }
}
