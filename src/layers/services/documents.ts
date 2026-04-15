import { documentsRepository } from "@/layers/repositories/documentsRepository";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import { getStorageBucket, s3 } from "@/lib/s3";

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

      const arrayBuffer = await input.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await s3.send(
        new PutObjectCommand({
          Bucket: getStorageBucket(),
          Key: storageKey,
          Body: buffer,
          ContentLength: input.size,
          ContentType: input.contentType,
        }),
      );

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

      const response = await s3.send(
        new GetObjectCommand({
          Bucket: getStorageBucket(),
          Key: document.storageKey,
        }),
      );

      if (!response.Body) {
        return null;
      }

      const fileBuffer = Buffer.from(await response.Body.transformToByteArray());

      return {
        document,
        fileBuffer,
      };
    } catch (err) {
      if (
        (err as { name?: string }).name === "NoSuchKey" ||
        (err as { name?: string }).name === "NotFound"
      ) {
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
