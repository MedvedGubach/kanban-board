import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schemas/typeDefs';
import { resolvers } from './graphql/resolvers/indexResolver';
import cors from 'cors';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
// Función principal para conectar a Mongo y arrancar el servidor
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB!');

    const app = express();
    app.use(cors());

    const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });

    await server.start();
    server.applyMiddleware({ app });

    const httpServer = app.listen(PORT, () => {
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
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
