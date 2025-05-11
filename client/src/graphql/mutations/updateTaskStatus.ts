import { gql } from "@apollo/client";

export const UPDATE_TASK_STATUS = gql`
   mutation UpdateTaskStatus($id: ID!, $status: String!) {
     updateTaskStatus(id: $id, status: $status) {
       id
       title
       description
       board
       createdBy
       status
     }
   }
`;
