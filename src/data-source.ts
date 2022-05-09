import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'raquelmms',
  password: '123abc',
  database: 'raquelmms',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
});
