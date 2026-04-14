import { documentsRepository } from "@/layers/repositories/documentsRepository";
import { randomUUID } from "crypto";
import path from "path";
import { promises as fs } from "fs";

export const documentsService = {
  async createAndSaveDocument(input: {
    ownerId: string;
    file: File;
    originalFilename: string;
    contentType: string;
    size: number;
  }) {
    try {
      const safeFilename = path.basename(input.originalFilename || "upload");
      const id = randomUUID();
      const fileNameOnDisk = `${id}-${safeFilename}`;
      const storageKey = `${input.ownerId}/${fileNameOnDisk}`;

      const uploadsDir = path.join(process.cwd(), "uploads");
      const filePath = path.join(uploadsDir, input.ownerId, fileNameOnDisk);

      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const arrayBuffer = await input.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      return documentsRepository.createDocument({
        ownerId: input.ownerId,
        displayName: input.originalFilename,
        contentType: input.contentType,
        originalFilename: input.originalFilename,
        size: input.size,
        storageKey,
      });
    } catch (err) {
      console.error("documentsService.createAndSaveDocument error:", err);
      throw err;
    }
  },

  async getStoredDocumentById(id: string) {
    try {
      const document = await documentsRepository.getById(id);

      if (!document) {
        return null;
      }

      const filePath = path.join(process.cwd(), "uploads", document.storageKey);
      const fileBuffer = await fs.readFile(filePath);

      return {
        document,
        fileBuffer,
      };
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }

      console.error("documentsService.getStoredDocumentById error:", err);
      throw err;
    }
  },

  async getAllDocumentsByOwnerId(ownerId: string) {
    try {
      const documents = await documentsRepository.getAllByOwnerId(ownerId);

      return documents;
    } catch (err) {
      console.error("documentsService.getAllDocumentsByOwnerId error:", err);
      throw err;
    }
  },
};
