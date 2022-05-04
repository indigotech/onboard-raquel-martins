export class User {
  constructor(id: number, firstName: string, lastName: string, age: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
  id: number;
  firstName: string;
  lastName: string;
  age: string;
}
