import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    user_name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type NewBoard {
    title: String!
    description: String!
    createdBy: String!
  }

 type NewTask {
  title: String!
  description: String!
  board: String!
  createdBy: String!
  status: String!
 }

 type NewSubTask{
  title: String! 
  subTask: String!
  taskId: String! 
  createdBy: String!
  subTaskStatus: String! 
  priority: String! 
  dueDate: String!
 }
  

 type UpdateSubTaskStatus{
  id: String!
  subTaskStatus: String!
 }

  type Mutation {
    register(user_name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload!
    createBoard(title: String!, description: String!): NewBoard!
    createTask(title: String!, description: String!, board: String!, status: String): NewTask!
    updateTaskStatus(id: ID!, status: String!): GetTasks!
    sendEmail(to: String!, subject: String!, text: String!): Boolean
    deleteBoard(id: String!): Boolean
    deleteTask(taskId: String!): Boolean
    createSubTask(title: String!, subTask: String!, taskId: String!, createdBy: String!, subTaskStatus: String!, priority: String!, dueDate: String!): NewSubTask!
    updateSubTaskStatus(id: String!, subTaskStatus: String!): UpdateSubTaskStatus!
  }

  type GetBoards{
    id: ID!
    title: String!
    description: String!
    createdBy: String!
  }

  type GetTasks{
    id: ID!
    title: String!
    description: String!
    board: String!
    createdBy: String!
    status: String!
  }

  type GetSubTasks{ 
   id: ID!
   title: String!
   subTask: String!
   taskId: String!
   createdBy: String!
   subTaskStatus: String!
   priority: String!
   dueDate: String!
  }

  type Query {
    getBoards: [GetBoards!]!
    getTasks(board: ID!): [GetTasks!]!
    getSubTasks(taskId: String!): [GetSubTasks!]!
  }

 
`;