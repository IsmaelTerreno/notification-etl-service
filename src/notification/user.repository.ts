import { DataSource } from 'typeorm';
import { Subscription } from './subscription.entity';
import { DATA_SOURCE } from '../database/database.providers';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const UserRepository = {
  provide: USER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Subscription),
  inject: [DATA_SOURCE],
};
