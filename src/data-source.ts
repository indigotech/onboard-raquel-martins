import { User } from './entity/User';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
});

export const connectToDB = async () => {
  await AppDataSource.setOptions({ url: process.env.DATA_URL }).initialize();
  console.info('DB connected');
};
