import { Module } from '@nestjs/common';
import { StellarBlockchainService } from './stellar-blockchain.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [StellarBlockchainService],
  exports: [StellarBlockchainService],
})
/**
 * The module that contains all the stellar blockchain related services.
 * This module is responsible for sending requests to the stellar blockchain server.
 */
export class StellarBlockchainModule {}
