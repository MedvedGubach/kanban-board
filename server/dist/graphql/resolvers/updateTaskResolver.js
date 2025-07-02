"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const task_1 = __importDefault(require("../../models/task"));
const updateTaskResolver = {
    Mutation: {
        updateTaskStatus: async (_, { id, status }) => {
            const updatedTask = await task_1.default.findByIdAndUpdate(id, { status }, { new: true });
            if (!updatedTask) {
                throw new apollo_server_express_1.ApolloError("Task not fround", "TASK_NOT_FOUND");
            }
            return updatedTask;
        }
    }
};
exports.default = updateTaskResolver;
