import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../database/database.providers';
import { User } from './user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const UserRepository = {
  provide: USER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: [DATA_SOURCE],
};
