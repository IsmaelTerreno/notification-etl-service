import { Module } from '@nestjs/common';
import { DecafApiService } from './decaf-api.service';
import { HttpModule } from '@nestjs/axios';

/**
 * Decaf API module to export the Decaf API service and make it available to the application.
 * We can import user data from the Decaf API and send notifications to the Decaf API.
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [DecafApiService],
  exports: [DecafApiService],
})
export class DecafApiModule {}
