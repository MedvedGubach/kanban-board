"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoardsResolver = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const board_1 = __importDefault(require("../../models/board"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
exports.getBoardsResolver = {
    Query: {
        getBoards: async (_, __, context) => {
            try {
                const user = (0, authMiddleware_1.authenticate)(context.req);
                if (!user) {
                    throw new apollo_server_errors_1.ApolloError("Unauthorized", "NO_TOKEN");
                }
                const boards = await board_1.default.find({ createdBy: user.id }).lean();
                if (!boards || boards.length === 0) {
                    throw new apollo_server_errors_1.ApolloError("No boards found", "NO_BOARDS");
                }
                return boards.map(board => ({
                    id: board._id.toString(),
                    title: board.title,
                    description: board.description,
                    createdBy: board.createdBy.toString(),
                }));
            }
            catch (error) {
                if (error instanceof apollo_server_errors_1.ApolloError)
                    throw error;
                throw new apollo_server_errors_1.ApolloError("Server failed to fetch boards", "SERVER_ERROR");
            }
        },
    },
};
