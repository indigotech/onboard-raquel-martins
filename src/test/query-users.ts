import axios from 'axios';
import { BASE_URL } from './constants';

export const queryGetAllUsers = (token) => {
  return axios.post(
    `${BASE_URL}`,
    {
      query: `
     query users{
     users{
      id
      name
      email
      birthDate
        }
      }
    `
    },
    {
      headers: {
        Authorization: token
      }
    }
  );
};
