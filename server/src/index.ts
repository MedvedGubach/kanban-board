import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schemas/typeDefs';
import { resolvers } from './graphql/resolvers/indexResolver';
import cors from 'cors';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN;
// Función principal para conectar a Mongo y arrancar el servidor
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB!');

    const app = express();

    const allowedOrigins = [
      'http://localhost:5173',
      'https://kanban-board-three-navy.vercel.app',
      'https://studio.apollographql.com'
    ];

    app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }, credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    const httpServer = app.listen(PORT, () => {
      console.log(`🚀 GraphQL server ready at ${process.env.NEXT_PUBLIC_GRAPHQL_URI || `http://localhost:${PORT}${server.graphqlPath}`}`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Server shutting down now... (${signal})...`);
      httpServer.close(async () => {
        console.log('✅ Server closed gracefully');
        await mongoose.connection.close();
        console.log('🧹 MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Error starting the server:', error);
    process.exit(1);
  }
}

startServer();
