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

  /**
   * Fetches users from the Decaf API and processes the response using the provided callback function.
   *
   * @param {Function} callbackFn - A callback function to handle the response received from the API.
   * @return {void} No return value.
   */
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

  /**
   * Sends a notification to the Decaf API.
   *
   * @param {Object} notification - The notification payload to be sent.
   * @param {Function} callbackFn - The callback function to handle the API response.
   * @return {void} This method does not return a value directly; any response or error is handled via the callback function and logging.
   */
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
