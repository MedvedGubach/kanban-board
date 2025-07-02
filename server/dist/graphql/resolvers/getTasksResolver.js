"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksResolver = void 0;
const task_1 = __importDefault(require("../../models/task"));
const mongoose_1 = __importDefault(require("mongoose"));
const apollo_server_express_1 = require("apollo-server-express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
exports.getTasksResolver = {
    Query: {
        getTasks: async (_, { board }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_express_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(board)) {
                    throw new apollo_server_express_1.ApolloError("Invalid board ID", "INVALID_BOARD_ID");
                }
                const tasksFind = await task_1.default.find({ board: new mongoose_1.default.Types.ObjectId(board) }).lean();
                if (!tasksFind || tasksFind.length === 0) {
                    throw new apollo_server_express_1.ApolloError("No tasks found", "NO_TASKS");
                }
                return tasksFind.map(task => ({
                    id: task._id.toString(),
                    title: task.title,
                    description: task.description,
                    board: task.board.toString(),
                    createdBy: task.createdBy.toString(),
                    status: task.status,
                }));
            }
            catch (error) {
                if (error instanceof apollo_server_express_1.ApolloError)
                    throw error;
                throw new apollo_server_express_1.ApolloError("Server failed to fetch tasks", "SERVER_ERROR");
            }
        }
    }
};
