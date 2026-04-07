import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const usersRepository = {
    async createUser(data: {
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }) {
        return prisma.user.create({
            data: {
                id: randomUUID(),
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                passwordHash: data.passwordHash,
            },
        });
    },
};
