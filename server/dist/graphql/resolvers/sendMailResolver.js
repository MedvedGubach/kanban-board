"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const apollo_server_express_1 = require("apollo-server-express");
const sendEmailResolver = {
    Mutation: {
        sendEmail: async (_, { to, subject, text }) => {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'emmanuel.arana.gutierrez@gmail.com',
                    pass: process.env.NODEMAILER_API_KEY,
                }
            });
            const mailOptions = {
                from: 'emmanuel.arana.gutierrez@gmail.com',
                to,
                subject,
                text
            };
            try {
                await transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error('Error al enviar el correo:', error);
                throw new apollo_server_express_1.ApolloError("Failed to send E-mail", "FAILED_TO_SEND");
            }
        }
    }
};
exports.default = sendEmailResolver;
