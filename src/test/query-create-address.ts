import axios from 'axios';
import { BASE_URL } from './constants';

export const queryCreateAddress = (input, token) => {
  return axios.post(
    `${BASE_URL}`,
    {
      query: `
     mutation Mutation($data: AddressInput!){
     createAddress(data: $data){
      city
      state
      neighborhood
      cep
      street
      streetNumber
      complement
      id
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
