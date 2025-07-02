"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subTask_1 = __importDefault(require("../../models/subTask"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const createSubTaskResolver = {
    Mutation: {
        createSubTask: async (_, { title, subTask, taskId, subTaskStatus, priority, dueDate }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_express_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                const newSubTask = await subTask_1.default.create({
                    title: title,
                    subTask: subTask,
                    taskId: new mongoose_1.default.Types.ObjectId(taskId),
                    createdBy: new mongoose_1.default.Types.ObjectId(user.id),
                    subTaskStatus: subTaskStatus,
                    priority: priority,
                    dueDate: dueDate
                });
                if (!newSubTask) {
                    throw new apollo_server_express_1.ApolloError("Failed to create sub-task", "FAIL_CREATE");
                }
                return {
                    title: newSubTask.title,
                    subTask: newSubTask.subTask,
                    taskId: newSubTask.taskId.toString(),
                    createdBy: newSubTask.createdBy.toString(),
                    subTaskStatus: newSubTask.subTaskStatus,
                    priority: newSubTask.priority,
                    dueDate: newSubTask.dueDate,
                };
            }
            catch (error) {
                if (error instanceof apollo_server_express_1.ApolloError) {
                    console.error('ApolloError:', error);
                    throw error;
                }
                console.error('Server Error:', error);
                throw new apollo_server_express_1.ApolloError("Server failed to create task", "SERVER_ERROR");
            }
        }
    }
};
exports.default = createSubTaskResolver;
