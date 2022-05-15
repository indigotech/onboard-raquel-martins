import axios from 'axios';
import { BASE_URL } from './BASE_URL';

export const queryLogin = async (input) => {
  return await axios.post(`${BASE_URL}`, {
    query: `
     mutation login($data: LoginInput!){
     login (data: $data){
     user {
      birthDate
      email
      name
      id
     }
     token
     }
    }           
    `,
    variables: {
      data: input
    }
  });
};