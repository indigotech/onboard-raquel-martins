import axios from 'axios';
import { BASE_URL } from './BASE_URL';

export const queryCreateUser = async (input) => {
  return await axios.post(`${BASE_URL}`, {
    query: `
     mutation createUser($data: UserInput!){
     createUser(data: $data){
      id
      name
      email
      birthDate
        }}
          `,
    variables: {
      data: input
    }
  });
};
