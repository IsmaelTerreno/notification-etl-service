import { DataSource } from 'typeorm';
import * as process from 'process';

export const DATA_SOURCE = 'DATA_SOURCE';
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
