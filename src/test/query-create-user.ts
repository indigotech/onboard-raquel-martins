import axios from 'axios';
import { BASE_URL } from './base-url';

export const queryCreateUser = async (input, token) => {
  return await axios.post(
    `${BASE_URL}`,
    {
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
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
};
