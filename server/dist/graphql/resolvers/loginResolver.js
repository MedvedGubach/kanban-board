"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../../models/user"));
const apollo_server_errors_1 = require("apollo-server-errors");
const loginResolver = {
    Mutation: {
        login: async (_, { email, password }) => {
            try {
                const userFind = await user_1.default.findOne({ email });
                if (!userFind)
                    throw new apollo_server_errors_1.ApolloError("Invalid credentials", "INVALID_CREDENTIALS");
                const valid = await bcrypt_1.default.compare(password, userFind.password);
                if (!valid)
                    throw new apollo_server_errors_1.ApolloError("Invalid credentials", "INVALID_CREDENTIALS");
                const token = jsonwebtoken_1.default.sign({ id: userFind.id, email: userFind.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
                return {
                    token,
                    user: {
                        id: userFind.id,
                        email: userFind.email,
                        user_name: userFind.user_name
                    }
                };
            }
            catch (error) {
                if (error instanceof apollo_server_errors_1.ApolloError)
                    throw error;
                console.error("Unexpected error during login:", error);
                throw new apollo_server_errors_1.ApolloError("Server failed to login, contact administrator", "SERVER_ERROR");
            }
        }
    }
};
exports.default = loginResolver;
