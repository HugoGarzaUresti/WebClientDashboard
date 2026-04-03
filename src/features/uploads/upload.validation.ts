import { z } from "zod";

export const createUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().positive().max(50 * 1024 * 1024),
});
