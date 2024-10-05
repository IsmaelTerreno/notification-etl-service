import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StellarBlockchainService {
  private readonly logger = new Logger(StellarBlockchainService.name);
  private readonly baseUrlStellar = process.env.STELLAR_BASE_SERVER_URL;
  private readonly transactionEndpointStellar =
    process.env.STELLAR_TRANSACTION_ENDPOINT;

  constructor(private readonly httpService: HttpService) {}

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
