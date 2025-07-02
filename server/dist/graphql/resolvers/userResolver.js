"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userResolver = {
    Mutation: {
        register: async (_, { user_name, email, password }) => {
            const existingUser = await user_1.default.findOne({ email });
            if (existingUser) {
                throw new Error("Email already in use");
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const newUser = new user_1.default({ user_name, email, password: hashedPassword });
            await newUser.save();
            return {
                id: newUser._id,
                user_name: newUser.user_name,
                email: newUser.email
            };
        }
    },
};
exports.default = userResolver;
