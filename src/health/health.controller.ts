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
      () => this.http.pingCheck('search-user-profile-decaf', 'https://68b4d0f0-d56c-476b-9b2b-367806e0abad.mock.pstmn.io/searchUserProfile'),
      () => this.http.pingCheck('notification-send-decaf', 'https://68b4d0f0-d56c-476b-9b2b-367806e0abad.mock.pstmn.io/notifications/send', { method: 'POST' }),
    ]);
  }
}
