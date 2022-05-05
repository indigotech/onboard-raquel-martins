export class User {
  constructor(
    name: string,
    email: string,
    password: string,
    birthDate: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
  }
  name: string;
  email: string;
  password: string;
  birthDate: string;
}
