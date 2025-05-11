import { gql } from "@apollo/client";

export const GET_BOARDS = gql`
  query GetBoards {
    getBoards {
      id
      title
      description
      createdBy
    }
  }
`;
