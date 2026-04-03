import { prisma } from "@/lib/prisma";

export const usersRepository = {
    async createUser(data: {
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }) {
        return prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                passwordHash: data.passwordHash,
            },
        });
    },
};
