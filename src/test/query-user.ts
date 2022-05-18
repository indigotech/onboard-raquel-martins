import axios from 'axios';
import { BASE_URL } from './constants';

export const queryGetUser = (id, token) => {
  return axios.post(
    `${BASE_URL}`,
    {
      query: `
     query user($id: String){
     user(id: $id){
      id
      name
      email
      birthDate
        }
      }
    `,
      variables: {
        id
      }
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
};
