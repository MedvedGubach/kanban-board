import { gql } from "@apollo/client";

export const DELETE_BOARD = gql`
 mutation DeleteBoard($id: String!){
  deleteBoard(id: $id)
 }
`