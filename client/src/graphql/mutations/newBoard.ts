import { gql } from "@apollo/client";

export const NEW_BOARD = gql`
  mutation NewBoard($title: String!, $description: String!){
  createBoard(title: $title, description: $description){ 
   title
   description
   createdBy
    }
  }
`


