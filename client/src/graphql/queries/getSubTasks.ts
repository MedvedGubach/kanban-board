import { gql } from "@apollo/client";

export const GET_SUBTASKS = gql`
  query GetSubTasks($taskId: String!){
   getSubTasks(taskId: $taskId){
    id
    title
    subTask
    taskId
    createdBy
    subTaskStatus
    priority
    dueDate
   }
  }
`