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

export const newAddress = () => {
  const address = {
    cep: faker.address.zipCode(),
    city: faker.address.city(),
    complement: faker.address.streetAddress(),
    neighborhood: faker.address.streetName(),
    state: faker.address.state(),
    street: faker.address.streetName(),
    streetNumber: Number(faker.random.numeric())
  };
  return address;
};
