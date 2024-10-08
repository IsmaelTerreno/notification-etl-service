import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

/**
 * The DatabaseModule is responsible for handling all database-related
 * service providers within the application.
 *
 * When imported into other modules, it provides access to
 * database services and functionality defined within the
 * `databaseProviders` array.
 *
 * This module both provides and exports the database services,
 * ensuring that they are available for dependency injection
 * throughout the application.
 */
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
