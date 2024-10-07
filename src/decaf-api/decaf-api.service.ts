import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DecafApiService {
  private readonly logger = new Logger(DecafApiService.name);
  private readonly baseUrlDecaf = process.env.DECAF_BASE_SERVER_URL;
  private readonly searchUserEndpoint = process.env.DECAF_SEARCH_USER_ENDPOINT;
  private readonly sendNotificationEndpoint =
    process.env.DECAF_SEND_NOTIFICATION_ENDPOINT;

  constructor(private readonly httpService: HttpService) {}

  importUsers(callbackFn) {
    this.logger.log('🛰 Fetching users from Decaf API...');
    this.httpService
      .get(this.baseUrlDecaf + this.searchUserEndpoint, {
        responseType: 'json',
        headers: {
          Accept: 'application/json',
        },
      })
      .subscribe({
        next: (response) => {
          callbackFn(response);
        },
        error: (error) => {
          this.logger.error(
            `❌ Failed fetching users from Decaf API - Details: ${error.message}`,
          );
          return error.message;
        },
      });
  }

  sendNotification(notification, callbackFn) {
    this.logger.log('🛰 Sending notification to Decaf API...');
    this.httpService
      .post(this.baseUrlDecaf + this.sendNotificationEndpoint, notification, {
        responseType: 'json',
        headers: {
          Accept: 'application/json',
        },
      })
      .subscribe({
        next: (response) => {
          callbackFn(response);
        },
        error: (error) => {
          this.logger.error(
            `❌ Failed sending notification to Decaf API - Details: ${error.message}`,
          );
          return error.message;
        },
      });
  }
}
