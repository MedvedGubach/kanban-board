import user from "../../models/user";
import bcrypt from "bcrypt";

const userResolver = {
    Mutation: {
        register: async (_: any, { user_name, email, password }: any) => {
            const existingUser = await user.findOne({ email });
            if (existingUser) { throw new Error("Email already in use"); }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new user({ user_name, email, password: hashedPassword });
            await newUser.save();

            return {
                id: newUser._id,
                user_name: newUser.user_name,
                email: newUser.email
            };
        }
    },
};


export default userResolver;