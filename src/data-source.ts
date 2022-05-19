import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [__dirname + '/entity/*{.js,.ts}'],
  migrations: [],
  subscribers: []
});

export const connectToDB = async () => {
  await AppDataSource.setOptions({ url: process.env.DATA_URL }).initialize();
  console.info('DB connected');
};
