import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';

let additionalSSLDatabaseConfig;
let baseDatabaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  migrationsRun: true,
};

let envBasedDatabaseConfig = {
  host: process.env.DB_HOSTNAME || 'immich_postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  connectTimeoutMS: 10000, // 10 seconds
};

const url = process.env.DB_URL;
additionalSSLDatabaseConfig = url ? ({ url }) : (envBasedDatabaseConfig)

export const databaseConfig: PostgresConnectionOptions = {...baseDatabaseConfig, ...additionalSSLDatabaseConfig};

export const dataSource = new DataSource(databaseConfig);