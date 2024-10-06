import { DataSource } from 'typeorm';
import { Subscription } from './subscription.entity';
import { DATA_SOURCE } from '../database/database.providers';

export const SUBSCRIPTION_REPOSITORY = 'SUBSCRIPTION_REPOSITORY';
export const SubscriptionRepository = {
  provide: SUBSCRIPTION_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Subscription),
  inject: [DATA_SOURCE],
};
