import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../database/database.providers';
import { User } from './user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';
/**
 * UserRepository is an object used to configure and provide the repository for the User entity.
 *
 * It contains:
 * - provide: A token that allows the repository to be injected wherever needed.
 * - useFactory: A factory function that creates the User repository using the provided data source.
 * - inject: An array of dependencies to be injected into the factory function, in this case, the data source.
 */
export const UserRepository = {
  provide: USER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: [DATA_SOURCE],
};
