import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../database/database.providers';
import { Account } from './account.entity';

export const ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY';
/**
 * The `AccountRepository` object provides the repository for interacting with
 * the `Account` entity. It uses a factory function to obtain the repository
 * from the specified `DataSource`.
 *
 * Properties:
 * - `provide`: A token representing the repository, in this case `ACCOUNT_REPOSITORY`.
 * - `useFactory`: A factory function which takes a `DataSource` as an argument and returns
 *   the repository for the `Account` entity using `dataSource.getRepository(Account)`.
 * - `inject`: An array of dependencies that the factory function requires,
 *   in this case, an instance of `DATA_SOURCE`.
 */
export const AccountRepository = {
  provide: ACCOUNT_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
  inject: [DATA_SOURCE],
};
