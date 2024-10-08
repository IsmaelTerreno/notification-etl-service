import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly appService: NotificationService) {}

  /**
   * Retrieves the list of transactions for payment updates.
   *
   * @return {Array|String} Returns an array of transaction objects if successful.
   *                        Returns an error message string if an error occurs.
   */
  @Get('transactions')
  getTransactions() {
    try {
      return this.appService.getTransactionsForPaymentsUpdates();
    } catch (error) {
      this.logger.error(
        `❌ Failed to get transactions - Details: ${error.message}`,
      );
      return error.message;
    }
  }
}
