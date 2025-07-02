"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subTask_1 = __importDefault(require("../../models/subTask"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const updateSubTaskStatusResolver = {
    Mutation: {
        updateSubTaskStatus: async (_, { id, subTaskStatus }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_express_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                ;
                const updateSubTaskStatus = await subTask_1.default.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(id), { subTaskStatus: subTaskStatus }).lean();
                if (!updateSubTaskStatus) {
                    throw new apollo_server_express_1.ApolloError("Failed to update task status", "FAILED_TO_UPDATE");
                }
                ;
                return {
                    id: updateSubTaskStatus._id.toString(),
                    subTaskStatus: updateSubTaskStatus.subTaskStatus
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
exports.default = updateSubTaskStatusResolver;
