import axios from 'axios';
import { BASE_URL } from './constants';

export const queryGetAllUsers = (token, page, quantity) => {
  return axios.post(
    `${BASE_URL}`,
    {
      query: `
     query users($page: Int, $quantity: Int) {
     users(page: $page, quantity: $quantity) {
        users {
            id
            name 
            email
            birthDate
            addresses {
              cep
              city
              complement
              neighborhood
              state
              street
              streetNumber
              id
            }
          }
          count
          before
          after
          page
        }
      }
    `,
      variables: {
        page: page,
        quantity: quantity
      }
    },

    {
      headers: {
        Authorization: token
      }
    }
  );
};
