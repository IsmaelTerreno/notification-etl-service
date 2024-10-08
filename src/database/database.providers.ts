import { DataSource } from 'typeorm';
import * as process from 'process';

export const DATA_SOURCE = 'DATA_SOURCE';
/**
 * An array of database providers to configure the database connection.
 *
 * The array contains objects that define how the database provider should be set up.
 * Each object includes a `provide` key with a token that can be used for dependency injection.
 * The `useFactory` key is an asynchronous function that initializes and returns a new DataSource instance.
 *
 * The DataSource initialization pulls in database configuration from environment variables:
 * - `HOST_DB_CONFIG`: Host of the database server
 * - `PORT_DB_CONFIG`: Port on which the database server is running
 * - `USER_NAME_DB_CONFIG`: Username for authentication
 * - `USER_PASSWORD_DB_CONFIG`: Password for authentication
 * - `DATABASE_NAME_DB_CONFIG`: Name of the database to connect to
 *
 * The `entities` array includes the path to the entity files and the `synchronize` option ensures that the database schema
 * is automatically synchronized with the entity definitions.
 *
 * @type {Array<Object>}
 */
export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.HOST_DB_CONFIG,
        port: parseInt(process.env.PORT_DB_CONFIG),
        username: process.env.USER_NAME_DB_CONFIG,
        password: process.env.USER_PASSWORD_DB_CONFIG,
        database: process.env.DATABASE_NAME_DB_CONFIG,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
