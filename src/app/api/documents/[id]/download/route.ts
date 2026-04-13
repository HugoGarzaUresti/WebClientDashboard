import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { documentsService } from "@/layers/services/documents";
import path from "path";

export const runtime = "nodejs";

const contentTypeExtensions: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "text/plain": ".txt",
  "text/csv": ".csv",
  "application/json": ".json",
  "application/zip": ".zip",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
};

function getExtensionFromContentType(contentType?: string) {
  if (!contentType) {
    return "";
  }

  const normalizedContentType = contentType
    .split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentTypeExtensions[normalizedContentType]) {
    return contentTypeExtensions[normalizedContentType];
  }

  const [, subtype = ""] = normalizedContentType.split("/");
  if (!subtype) {
    return "";
  }

  const normalizedSubtype = subtype
    .replace(/^vnd\./, "")
    .replace(/\+xml$/, "")
    .replace(/\+json$/, "")
    .split(".")
    .pop();

  return normalizedSubtype ? `.${normalizedSubtype}` : "";
}

function buildDownloadFilename(filename: string, contentType?: string) {
  const baseFilename = path.basename(filename);
  const currentExtension = path.extname(baseFilename).toLowerCase();
  const expectedExtension = getExtensionFromContentType(contentType);

  if (!expectedExtension || currentExtension === expectedExtension) {
    return baseFilename;
  }

  return `${baseFilename}${expectedExtension}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const storedDocument = await documentsService.getStoredDocumentById(id);

  if (!storedDocument || storedDocument.document.ownerId !== session.user.id) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  const filename = buildDownloadFilename(
    storedDocument.document.originalFilename ||
      storedDocument.document.displayName ||
      "document",
    storedDocument.document.contentType,
  );
  const encodedFilename = encodeURIComponent(filename);
  const asciiFilename = filename.replace(/["\r\n]/g, "");
  console.log("File name is: ", filename);

  return new Response(storedDocument.fileBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        storedDocument.document.contentType || "application/octet-stream",
      "Content-Length": storedDocument.fileBuffer.byteLength.toString(),
      "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
      "Cache-Control": "private, no-store",
      "X-Download-Filename": filename,
    },
  });
}
