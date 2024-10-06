import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('transactions-blockchain-stellar', process.env.STELLAR_BASE_SERVER_URL + process.env.STELLAR_TRANSACTION_ENDPOINT),
      () => this.http.pingCheck('search-user-profile-decaf', process.env.DECAF_BASE_SERVER_URL + process.env.DECAF_SEARCH_USER_ENDPOINT),
      () => this.http.pingCheck('notification-send-decaf', process.env.DECAF_BASE_SERVER_URL + process.env.DECAF_SEND_NOTIFICATION_ENDPOINT, { method: 'POST' }),
    ]);
  }
}
