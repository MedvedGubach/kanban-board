import { gql } from "@apollo/client";

export const CREATE_SUB_TASK = gql`
  mutation NewSubTask($title: String!, $subTask: String!, $taskId: String!, $createdBy: String!, $subTaskStatus: String!, $priority: String!, $dueDate: String!){
   createSubTask(title: $title, subTask: $subTask, taskId: $taskId, createdBy: $createdBy, subTaskStatus: $subTaskStatus, priority: $priority, dueDate: $dueDate){
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