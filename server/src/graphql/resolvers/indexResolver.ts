import userResolver from "./userResolver";
import loginResolver from "./loginResolver";
import createBoardResolver from "./createBoardResolver";
import { getBoardsResolver } from "./getBoardsResolver";
import createTaskResolver from "./createTaskResolver";
import { getTasksResolver } from "./getTasksResolver";
import updateTaskResolver from "./updateTaskResolver";
import sendEmailResolver from "./sendMailResolver";
import deleteBoardResolver from "./deleteBoardResolver";
import deleteTaskResolver from "./deleteTaskResolver";
import createSubTaskResolver from "./createSubTaskResolver";
import getSubTaskResolver from "./getSubTasksResolver";
import updateSubTaskStatusResolver from "./updateSubTaskStatusResolver";

/* Resolvers */
export const resolvers = {
    Query: {
        ...getBoardsResolver.Query,
        ...getTasksResolver.Query,
        ...getSubTaskResolver.Query,
        // Add query type resolvers here
    },
    Mutation: {
        ...userResolver.Mutation,
        ...loginResolver.Mutation,
        ...createBoardResolver.Mutation,
        ...createTaskResolver.Mutation,
        ...updateTaskResolver.Mutation,
        ...sendEmailResolver.Mutation,
        ...deleteBoardResolver.Mutation,
        ...deleteTaskResolver.Mutation,
        ...createSubTaskResolver.Mutation,
        ...updateSubTaskStatusResolver.Mutation,
        // Add mutation type resolvers here
    }
};