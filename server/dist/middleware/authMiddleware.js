"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";
const authenticate = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Authentication token must be 'Bearer [token]'");
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            return decodedToken;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError("Invalid/Expired token", "INVALID_TOKEN");
        }
    }
    throw new apollo_server_express_1.ApolloError("Authorization header must be provided", "AUTH_HEADER_MISSING");
};
exports.authenticate = authenticate;
