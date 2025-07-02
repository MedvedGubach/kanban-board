"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __importDefault(require("../../models/board"));
const apollo_server_express_1 = require("apollo-server-express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
const deleteBoardResolver = {
    Mutation: {
        deleteBoard: async (_, { id }, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_express_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    throw new apollo_server_express_1.ApolloError("Invalid board ID", "INVALID_ID");
                }
                const deleteBoard = await board_1.default.findOneAndDelete({ _id: new mongoose_1.default.Types.ObjectId(id), createdBy: new mongoose_1.default.Types.ObjectId(user.id) });
                if (!deleteBoard) {
                    throw new apollo_server_express_1.ApolloError("Failed to find board", "FAILED_TO_DELETE");
                }
                else {
                    return true;
                }
            }
            catch (error) {
                if (error instanceof apollo_server_express_1.ApolloError)
                    throw error;
                throw new apollo_server_express_1.ApolloError("Server failed to delete board", "SERVER_ERROR");
            }
        }
    }
};
exports.default = deleteBoardResolver;
