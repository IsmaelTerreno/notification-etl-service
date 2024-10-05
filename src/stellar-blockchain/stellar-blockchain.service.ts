import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as StellarSdk from '@stellar/stellar-sdk';
import * as EventSource from 'eventsource';

@Injectable()
export class StellarBlockchainService {
  private readonly logger = new Logger(StellarBlockchainService.name);
  private readonly baseUrlStellar = process.env.STELLAR_BASE_SERVER_URL;
  private readonly transactionEndpointStellar =
    process.env.STELLAR_TRANSACTION_ENDPOINT;

  constructor(private readonly httpService: HttpService) {}

  getTransactions(callbackFn: Function) {
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

  getTransactionSDK(callbackFn: Function) {
    const server = new StellarSdk.Horizon.Server(this.baseUrlStellar);
    this.logger.log('🚀 Getting transaction details using Stellar SDK...');
  }

  getTransactionsEventSource(callbackFn: Function) {
    const es = new EventSource(
      this.baseUrlStellar + this.transactionEndpointStellar,
    );
    // es.onmessage = (message) => {
    //   const result = message.data ? JSON.parse(message.data) : message;
    //   callbackFn(result);
    // };
    // es.onerror = (error) => {
    //   return error.message;
    // };
  }
}
