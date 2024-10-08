import { DataSource } from 'typeorm';
import { Subscription } from './subscription.entity';
import { DATA_SOURCE } from '../database/database.providers';

export const SUBSCRIPTION_REPOSITORY = 'SUBSCRIPTION_REPOSITORY';
/**
 * SubscriptionRepository is an object that provides the repository for managing Subscription entities.
 * It uses a factory function to create the repository from a given data source.
 *
 * Properties:
 * - provide: The token used to inject the repository, represented by SUBSCRIPTION_REPOSITORY.
 * - useFactory: A factory function that takes a data source and returns the repository for Subscription entities.
 * - inject: An array specifying the dependencies to be injected into the factory function, specifically DATA_SOURCE.
 */
export const SubscriptionRepository = {
  provide: SUBSCRIPTION_REPOSITORY,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Subscription),
  inject: [DATA_SOURCE],
};
