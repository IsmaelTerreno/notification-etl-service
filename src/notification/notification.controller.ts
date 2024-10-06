import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly appService: NotificationService) {
  }

  @Get('transactions')
  getTransactions() {
    try {
      return this.appService.getTransactions();
    } catch (error) {
      this.logger.error(
        `❌ Failed to get transactions - Details: ${error.message}`,
      );
      return error.message;
    }
  }
}
