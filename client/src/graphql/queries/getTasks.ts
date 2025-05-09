import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query GetTasks($board: ID!) {
    getTasks(board: $board) {
      id
      title
      description
      board
      createdBy
      status
    }
  }
`;
