import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import user from "../../models/user";
import { ApolloError } from "apollo-server-errors";

const loginResolver = {

    Mutation: {
        login: async (_: any, { email, password }: { email: string, password: string }) => {
            try {
                const userFind = await user.findOne({ email });
                if (!userFind) throw new ApolloError("Invalid credentials", "INVALID_CREDENTIALS");
                
                const valid = await bcrypt.compare(password, userFind.password);
                if (!valid) throw new ApolloError("Invalid credentials", "INVALID_CREDENTIALS");

                const token = jwt.sign(
                    { id: userFind.id, email: userFind.email },
                    process.env.JWT_SECRET!,
                    { expiresIn: "1d" }
                );

                return {
                    token,
                    user: {
                        id: userFind.id,
                        email: userFind.email,
                        user_name: userFind.user_name
                    }
                };
            } catch (error) {
                if (error instanceof ApolloError) throw error;
                console.error("Unexpected error during login:", error);
                throw new ApolloError("Server failed to login, contact administrator", "SERVER_ERROR");
            }
        }
    }
};
export default loginResolver;