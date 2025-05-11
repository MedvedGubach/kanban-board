import jwt from "jsonwebtoken";
import { Request } from "express";
import { ApolloError } from "apollo-server-express";

const SECRET_KEY = process.env.JWT_SECRET || "SECRET_KEY";

interface DecodedToken {
    id: string,
    email: string,
    user_name: string,
    iat: number,
    exp: number,
}

export const authenticate = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new Error("Authentication token must be 'Bearer [token]'");
        }

        try {
            const decodedToken = jwt.verify(token, SECRET_KEY) as DecodedToken;
            return decodedToken;
        } catch (error) {
            throw new ApolloError("Invalid/Expired token", "INVALID_TOKEN");
        }
    }
    throw new ApolloError("Authorization header must be provided", "AUTH_HEADER_MISSING");
};