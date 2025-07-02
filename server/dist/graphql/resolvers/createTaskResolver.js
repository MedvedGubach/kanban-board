"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = __importDefault(require("../../models/task"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const createTaskResolver = {
    Mutation: {
        createTask: async (_, { title, description, board, status }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_express_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                const newTask = await task_1.default.create({ title, description, board, createdBy: new mongoose_1.default.Types.ObjectId(user.id), status });
                if (!newTask) {
                    throw new apollo_server_express_1.ApolloError("Failed to create task", "FAIL_CREATE");
                }
                return {
                    title: newTask.title,
                    description: newTask.description,
                    board: newTask.board.toString(),
                    createdBy: newTask.createdBy.toString(),
                    status: newTask.status,
                };
            }
            catch (error) {
                if (error instanceof apollo_server_express_1.ApolloError)
                    throw error;
                throw new apollo_server_express_1.ApolloError("Server failed to create task", "SERVER_ERROR");
            }
        }
    }
};
exports.default = createTaskResolver;
