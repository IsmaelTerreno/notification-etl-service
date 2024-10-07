import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
/**
 * Database module to export the database providers and make them available to the application
 * in this way we can use the database connection in the entire application
 */
export class DatabaseModule {}
