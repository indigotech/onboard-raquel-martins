import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { config } from 'dotenv';

config({ path: `${process.cwd()}/test.env` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
});
