import { Module } from '@nestjs/common';
import { DecafApiService } from './decaf-api.service';
import { HttpModule } from '@nestjs/axios';

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
