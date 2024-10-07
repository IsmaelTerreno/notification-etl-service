import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../database/database.providers';
import { Account } from './account.entity';

export const ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY';
export const AccountRepository = {
  provide: ACCOUNT_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
  inject: [DATA_SOURCE],
};
