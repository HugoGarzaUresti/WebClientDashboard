import { documentsRepository } from "@/layers/repositories/documentsRepository";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export const documentsService = {
    async createAndSaveDocument(input: {
        ownerId: string;
        file: File;
        originalFilename: string;
        contentType: string;
        size: number;
    }) {
        const storageKey = `${input.ownerId}/${randomUUID()}-${input.originalFilename}`;
        const uploadsDir = path.join(process.cwd(), "uploads");
        const filePath = path.join(uploadsDir, storageKey);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const buffer = Buffer.from(await input.file.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        return documentsRepository.createDocument({
            ownerId: input.ownerId,
            displayName: input.originalFilename,
            contentType: input.contentType,
            originalFilename: input.originalFilename,
            size: input.size,
            storageKey,
        });
    }
};
