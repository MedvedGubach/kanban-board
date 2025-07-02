"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    user_name: { type: String, required: [true, "User name is mandatory"], },
    email: { type: String, required: [true, "Email is mandatory"], unique: true, match: [/\S+@\S+\.\S+/, "Email not valid"], },
    password: { type: String, required: [true, "Password is mandatory and at least 6 characters"], minlength: 6, },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
