// src/app/api/documents/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { documentsService } from "@/layers/services/documents";

export const POST = async (req: Request) => {
  const form = await req.formData();
  const file = form.get("file") as File;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ownerId = session.user.id;

  const doc = await documentsService.createAndSaveDocument({
    ownerId: session.user.id,
    file,
    originalFilename: (form.get("originalFilename") as string) ?? file?.name,
    contentType: (form.get("contentType") as string) ?? file?.type ?? "application/octet-stream",
    size: Number(form.get("size") ?? (file ? (await file.arrayBuffer()).byteLength : 0)),
  });

  return NextResponse.json({ document: doc });
};