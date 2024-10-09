import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DecafApiService {
  private readonly logger = new Logger(DecafApiService.name);
  private readonly baseUrlDecaf = process.env.DECAF_BASE_SERVER_URL;
  private readonly searchUserEndpoint = process.env.DECAF_SEARCH_USER_ENDPOINT;

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
}
