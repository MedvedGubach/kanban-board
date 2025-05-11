import { gql } from "@apollo/client";

export const UPDATE_SUBTASK_STATUS = gql`
 mutation UpdateSubTaskStatus($id: String!, $subTaskStatus: String!){
   updateSubTaskStatus(id: $id, subTaskStatus: $subTaskStatus ){
     id
     subTaskStatus
   }
 }
`