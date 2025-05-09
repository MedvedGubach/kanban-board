import { gql } from "@apollo/client";

export const NEW_TASK = gql`
  mutation NewTask($title: String!, $description: String!, $board: String!, $status: String){
   createTask(title: $title, description: $description, board: $board, status: $status){
   title
   description
   board
   createdBy
   status
   }
  }
`