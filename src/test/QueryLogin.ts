import axios from 'axios';
import { BASE_URL } from './BASE_URL';

export const QueryLogin = async (input) => {
  return await axios.post(BASE_URL(), {
    query: `
              mutation login($data: LoginUserInput!){
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
