import axios from 'axios';
import { BASE_URL } from './constants';

export const queryCreateUser = (input, token) => {
  return axios.post(
    `${BASE_URL}`,
    {
      query: `
     mutation createUser($data: UserInput!){
     createUser(data: $data){
      id
      name
      email
      birthDate
        }
      }
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
