import bcrypt from "bcrypt";
import { usersRepository } from "@/layers/repositories/usersRepository";

export const usersService = {
    async register(input: {
        email?: string;
        firstName?: string;
        lastName?: string;
        password?: string;
    }) {
        const { email, firstName, lastName, password } = input;

        if (!email || !firstName || !lastName || !password) {
            throw new Error("Missing required fields");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await usersRepository.createUser({
            email,
            firstName,
            lastName,
            passwordHash,
        });

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
        };
    },
};
