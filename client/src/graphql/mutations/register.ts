import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($user_name: String!, $email: String!, $password: String!) {
    register(user_name: $user_name, email: $email, password: $password) {
      id
      user_name
      email
    }
  }
`;
