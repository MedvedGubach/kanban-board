"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = require("./graphql/schemas/typeDefs");
const indexResolver_1 = require("./graphql/resolvers/indexResolver");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN;
// Función principal para conectar a Mongo y arrancar el servidor
async function startServer() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB!');
        const app = (0, express_1.default)();
        const allowedOrigins = [
            'http://localhost:5173',
            'https://kanban-board-three-navy.vercel.app',
            'https://studio.apollographql.com'
        ];
        app.use((0, cors_1.default)({
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            }, credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        const server = new apollo_server_express_1.ApolloServer({ typeDefs: typeDefs_1.typeDefs, resolvers: indexResolver_1.resolvers, context: ({ req }) => ({ req }), persistedQueries: false });
        await server.start();
        server.applyMiddleware({ app, path: "/graphql" });
        const httpServer = app.listen(PORT, /* '0.0.0.0', */ () => {
            console.log(`🚀 GraphQL server ready at ${process.env.NEXT_PUBLIC_GRAPHQL_URI || `http://localhost:${PORT}${server.graphqlPath}`}`);
        });
        const gracefulShutdown = async (signal) => {
            console.log(`\n🛑 Server shutting down now... (${signal})...`);
            httpServer.close(async () => {
                console.log('✅ Server closed gracefully');
                await mongoose_1.default.connection.close();
                console.log('🧹 MongoDB connection closed');
                process.exit(0);
            });
        };
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    }
    catch (error) {
        console.error('❌ Error starting the server:', error);
        process.exit(1);
    }
}
startServer();
