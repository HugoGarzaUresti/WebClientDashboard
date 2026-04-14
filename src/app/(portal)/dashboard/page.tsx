import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import authOptions from "@/lib/auth";
import { documentsService } from "@/layers/services/documents";

import {
  DashboardDocumentsView,
  type DashboardDocument,
} from "./_components/dashboard-documents-view";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const documents = await documentsService.getAllDocumentsByOwnerId(
    session.user.id,
  );

  const initialDocuments: DashboardDocument[] = documents.map((document) => ({
    id: document.id,
    ownerId: document.ownerId,
    displayName: document.displayName,
    contentType: document.contentType,
    storageKey: document.storageKey,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
    originalFilename: document.originalFilename,
    size: document.size,
    status: document.status,
  }));

  return <DashboardDocumentsView documents={initialDocuments} />;
}
