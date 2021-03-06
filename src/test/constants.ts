export const BASE_URL = 'http://localhost:4001';

export const randomId = '69b4e9aa-bafa-4463-bb2d-ad8cb3f88bd4';

export const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTA4YmEzMi1mMGIxLTQ2NzUtODdkNi1kMmQ4ZWE3NGQxZWIiLCJlbWFpbCI6ImJvbG9AYm9sby5jb20iLCJpYXQiOjE2NTI1NzIzMzZ9.tgywb36uhPnxNQcYSUmRExNZgS56ftIF7CbQEBmgNhM';

export const inputCreateUserOne = {
  name: 'User',
  email: 'userteste@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};

export const inputCreateUserTwo = {
  name: 'UserTeste2',
  email: 'userteste2@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};

export const loginInput = {
  email: 'userteste@email.com',
  password: '1234abc'
};

export const fakeUser = {
  id: randomId,
  name: 'UserTeste2',
  email: 'userteste2@email.com',
  password: '1234abc',
  birthDate: '10-10-2000'
};

//Create Address

export const inputAddress = {
  cep: '01155060',
  street: 'Rua Brigadeiro Galvão',
  complement: 'prédio 1',
  streetNumber: 645,
  neighborhood: 'Barra funda',
  city: 'São paulo',
  state: 'SP'
};
