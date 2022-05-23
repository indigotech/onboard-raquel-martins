import faker from '@faker-js/faker/locale/de';
import { toHashPassword } from '../functions';

export const newUser = async () => {
  const user = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    birthDate: faker.internet.email(),
    password: await toHashPassword(faker.internet.password())
  };
  return user;
};
