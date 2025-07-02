"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    board: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Board" /* Relaciona con el board al que pertenece || links to the board the task belongs to */,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User" /* El usuario que lo creó || user who created it */,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "In progress",
            "Complete",
        ],
        default: "Pending",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("task", taskSchema);
