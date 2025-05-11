import { ApolloError } from "apollo-server-express";
import task from "../../models/task";

const updateTaskResolver = {
    Mutation: {
        updateTaskStatus: async (_: any, { id, status }: { id: string, status: string }) => {
            const updatedTask = await task.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            if (!updatedTask) { throw new ApolloError("Task not fround", "TASK_NOT_FOUND") }

            return updatedTask
        }
    }
}

export default updateTaskResolver