"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userResolver_1 = __importDefault(require("./userResolver"));
const loginResolver_1 = __importDefault(require("./loginResolver"));
const createBoardResolver_1 = __importDefault(require("./createBoardResolver"));
const getBoardsResolver_1 = require("./getBoardsResolver");
const createTaskResolver_1 = __importDefault(require("./createTaskResolver"));
const getTasksResolver_1 = require("./getTasksResolver");
const updateTaskResolver_1 = __importDefault(require("./updateTaskResolver"));
const sendMailResolver_1 = __importDefault(require("./sendMailResolver"));
const deleteBoardResolver_1 = __importDefault(require("./deleteBoardResolver"));
const deleteTaskResolver_1 = __importDefault(require("./deleteTaskResolver"));
const createSubTaskResolver_1 = __importDefault(require("./createSubTaskResolver"));
const getSubTasksResolver_1 = __importDefault(require("./getSubTasksResolver"));
const updateSubTaskStatusResolver_1 = __importDefault(require("./updateSubTaskStatusResolver"));
/* Resolvers */
exports.resolvers = {
    Query: {
        ...getBoardsResolver_1.getBoardsResolver.Query,
        ...getTasksResolver_1.getTasksResolver.Query,
        ...getSubTasksResolver_1.default.Query,
        // Add query type resolvers here
    },
    Mutation: {
        ...userResolver_1.default.Mutation,
        ...loginResolver_1.default.Mutation,
        ...createBoardResolver_1.default.Mutation,
        ...createTaskResolver_1.default.Mutation,
        ...updateTaskResolver_1.default.Mutation,
        ...sendMailResolver_1.default.Mutation,
        ...deleteBoardResolver_1.default.Mutation,
        ...deleteTaskResolver_1.default.Mutation,
        ...createSubTaskResolver_1.default.Mutation,
        ...updateSubTaskStatusResolver_1.default.Mutation,
        // Add mutation type resolvers here
    }
};
