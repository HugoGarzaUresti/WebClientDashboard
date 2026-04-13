// src/layers/repositories/documentsRepository.ts
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const documentsRepository = {
  async createDocument(input: {
    ownerId: string;
    displayName: string;
    contentType: string;
    storageKey: string;
    originalFilename?: string;
    size?: number;
  }) {
    return prisma.document.create({
      data: {
        id: randomUUID(),
        ownerId: input.ownerId,
        displayName: input.displayName,
        contentType: input.contentType,
        storageKey: input.storageKey,
        originalFilename: input.originalFilename ?? input.displayName,
        size: input.size ?? 0,
        updatedAt: new Date(),
      },
    });
  },

  async markReady(id: string) {
    return prisma.document.update({
      where: { id },
      data: { status: "READY", updatedAt: new Date() },
    });
  },
  
    async getById(id: string) {
    return prisma.document.findUnique({ where: { id } });
  }
};
