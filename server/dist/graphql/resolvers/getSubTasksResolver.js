"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subTask_1 = __importDefault(require("../../models/subTask"));
const apollo_server_errors_1 = require("apollo-server-errors");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
const getSubTaskResolver = {
    Query: {
        getSubTasks: async (_, { taskId }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_errors_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                const getSubTasks = await subTask_1.default.find({
                    createdBy: new mongoose_1.default.Types.ObjectId(user.id),
                    taskId: new mongoose_1.default.Types.ObjectId(taskId)
                }).lean();
                if (!getSubTasks || getSubTasks.length === 0) {
                    throw new apollo_server_errors_1.ApolloError("No subtasks found", "NO_SUBTASKS");
                }
                return getSubTasks.map(subtask => ({
                    id: subtask._id.toString(),
                    title: subtask.title,
                    subTask: subtask.subTask,
                    taskId: subtask.taskId.toString(),
                    createdBy: subtask.createdBy.toString(),
                    subTaskStatus: subtask.subTaskStatus,
                    priority: subtask.priority,
                    dueDate: subtask.dueDate
                }));
            }
            catch (error) {
                if (error instanceof apollo_server_errors_1.ApolloError)
                    throw error;
                throw new apollo_server_errors_1.ApolloError("Server failed to fetch subtasks", "SERVER_ERROR");
            }
        }
    }
};
exports.default = getSubTaskResolver;
