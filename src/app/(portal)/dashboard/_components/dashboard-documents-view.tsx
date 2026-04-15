"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  FileTextIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  MenuIcon,
  UploadIcon,
} from "lucide-react";

import { PortalSidebar } from "@/app/(portal)/_components/portal-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DashboardDocument = {
  id: string;
  ownerId: string;
  displayName: string;
  contentType: string;
  storageKey: string;
  createdAt: string;
  updatedAt: string;
  originalFilename: string;
  size: number;
  status: string;
  userFirstName: string;
  userLastName: string;
};

type DashboardDocumentsViewProps = {
  documents: DashboardDocument[];
};

type Notice = {
  tone: "default" | "error";
  text: string;
} | null;

const portalSidebarItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
] as const;

const uploadDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Mexico_City",
});

function getFilenameFromDisposition(contentDisposition: string | null) {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="([^"]+)"/i);
  return asciiMatch?.[1] ?? null;
}

function formatDocumentSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let currentSize = size / 1024;
  let unitIndex = 0;

  while (currentSize >= 1024 && unitIndex < units.length - 1) {
    currentSize /= 1024;
    unitIndex += 1;
  }

  return `${currentSize.toFixed(currentSize >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDocumentType(document: DashboardDocument) {
  const fileName = document.displayName || document.originalFilename;
  const extension = fileName.split(".").pop();

  if (extension && extension !== fileName) {
    return extension.toUpperCase();
  }

  const subtype = document.contentType.split("/").pop();
  if (!subtype) {
    return "FILE";
  }

  return subtype.split(".").pop()?.split("+")[0]?.toUpperCase() ?? "FILE";
}

function formatDocumentStatus(status: string) {
  return `${status.slice(0, 1)}${status.slice(1).toLowerCase()}`;
}

function formatUploadDate(createdAt: string) {
  return uploadDateFormatter.format(new Date(createdAt));
}

function getStatusVariant(status: string) {
  switch (status) {
    case "READY":
      return "success" as const;
    case "FAILED":
      return "destructive" as const;
    case "PENDING":
    default:
      return "warning" as const;
  }
}

export function DashboardDocumentsView({
  documents,
}: DashboardDocumentsViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const documentIds = new Set(documents.map((document) => document.id));
  const validSelectedIds = selectedIds.filter((id) => documentIds.has(id));

  const selectedDocuments = documents.filter((document) =>
    validSelectedIds.includes(document.id),
  );
  const hasDocuments = documents.length > 0;
  const allDocumentsSelected =
    hasDocuments && validSelectedIds.length === documents.length;
  const someDocumentsSelected =
    validSelectedIds.length > 0 && !allDocumentsSelected;
  const isBusy = isDownloading || isUploading || isRefreshing;

  function toggleAllDocuments(checked: boolean | "indeterminate") {
    setSelectedIds(
      checked === true ? documents.map((document) => document.id) : [],
    );
  }

  function toggleDocumentSelection(
    documentId: string,
    checked: boolean | "indeterminate",
  ) {
    setSelectedIds((currentSelection) => {
      const currentValidSelection = currentSelection.filter((id) =>
        documentIds.has(id),
      );

      if (checked === true) {
        if (currentValidSelection.includes(documentId)) {
          return currentValidSelection;
        }

        return [...currentValidSelection, documentId];
      }

      return currentValidSelection.filter((id) => id !== documentId);
    });
  }

  async function handleUpload(file: File) {
    setIsUploading(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("originalFilename", file.name);
      formData.append("contentType", file.type || "application/octet-stream");
      formData.append("size", String(file.size));

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setNotice({
          tone: "error",
          text: body?.error ?? "Upload failed. Please try again.",
        });
        return;
      }

      setNotice({
        tone: "default",
        text: `${file.name} uploaded successfully.`,
      });
      startRefreshTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setNotice({
        tone: "error",
        text: "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    void handleUpload(file);
    event.target.value = "";
  }

  async function downloadDocumentFile(documentItem: DashboardDocument) {
    const response = await fetch(`/api/documents/${documentItem.id}/download`, {
      method: "GET",
      credentials: "same-origin",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error ?? response.statusText);
    }

    const blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const filename =
      response.headers.get("X-Download-Filename") ||
      getFilenameFromDisposition(response.headers.get("Content-Disposition")) ||
      documentItem.displayName ||
      "document";

    const anchor = window.document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(href);
  }

  async function handleDownloadSelection() {
    if (selectedDocuments.length === 0) {
      return;
    }

    setIsDownloading(true);
    setNotice(null);

    const failedDownloads: string[] = [];

    for (const documentItem of selectedDocuments) {
      try {
        await downloadDocumentFile(documentItem);
      } catch (error) {
        console.error("Download failed:", error);
        failedDownloads.push(documentItem.displayName);
      }
    }

    if (failedDownloads.length > 0) {
      setNotice({
        tone: "error",
        text:
          failedDownloads.length === selectedDocuments.length
            ? "Unable to download the selected documents."
            : `Downloaded ${selectedDocuments.length - failedDownloads.length} of ${selectedDocuments.length} selected documents.`,
      });
    } else {
      setNotice({
        tone: "default",
        text: `Downloaded ${selectedDocuments.length} document${selectedDocuments.length === 1 ? "" : "s"}.`,
      });
    }

    setIsDownloading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 p-3 sm:p-4 lg:gap-6 lg:p-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <PortalSidebar items={portalSidebarItems} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl bg-card shadow-sm"
                >
                  <MenuIcon className="size-[18px]" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="border-0 bg-transparent p-0 shadow-none"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Dashboard navigation</SheetTitle>
                  <SheetDescription>
                    Navigate through the document portal.
                  </SheetDescription>
                </SheetHeader>
                <div className="h-full p-3">
                  <PortalSidebar
                    items={portalSidebarItems}
                    onNavigate={() => {
                      setMobileSidebarOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FolderKanbanIcon className="size-4" />
              </div>
              <span className="font-medium text-foreground">ClientDocs</span>
            </div>
          </div>

          <main className="flex-1">
            <section className="relative overflow-hidden rounded-[30px] border border-border bg-card shadow-lg backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/12 via-transparent to-secondary/12" />

              <div className="relative flex flex-col gap-6 p-5 sm:p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                        Workspace
                      </p>
                      <h1 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
                        My Documents
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Manage your uploads, review document status, and
                        download selected files from one place.
                      </p>
                    </div>

                    <Badge variant="secondary" className="w-fit px-3 py-1.5">
                      {validSelectedIds.length > 0
                        ? `${validSelectedIds.length} selected`
                        : `${documents.length} total`}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      onChange={handleFileSelection}
                    />

                    <Button
                      className="h-10 rounded-2xl px-4"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isBusy}
                    >
                      <UploadIcon className="size-4" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>

                    <Button
                      variant="outline"
                      className="h-10 rounded-2xl border-border bg-background px-4"
                      onClick={() => {
                        void handleDownloadSelection();
                      }}
                      disabled={selectedDocuments.length === 0 || isBusy}
                    >
                      <DownloadIcon className="size-4" />
                      {isDownloading ? "Downloading..." : "Download"}
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      Select one or more documents to enable download.
                    </p>
                  </div>

                  {notice ? (
                    <p
                      className={cn(
                        "text-sm",
                        notice.tone === "error"
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {notice.text}
                    </p>
                  ) : null}

                  {isRefreshing ? (
                    <p className="text-sm text-muted-foreground">
                      Refreshing your latest documents...
                    </p>
                  ) : null}
                </div>

                <div className="overflow-hidden rounded-[26px] border border-border/70 bg-card">
                  <Table className="min-w-[820px]">
                    <TableHeader className="bg-muted/45">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-14 pl-5">
                          <Checkbox
                            aria-label="Select all documents"
                            checked={
                              allDocumentsSelected
                                ? true
                                : someDocumentsSelected
                                  ? "indeterminate"
                                  : false
                            }
                            disabled={isBusy || !hasDocuments}
                            onCheckedChange={toggleAllDocuments}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Upload date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {documents.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={7} className="h-72">
                            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <FileTextIcon className="size-6" />
                              </div>
                              <div className="space-y-2">
                                <p className="text-lg font-medium text-foreground">
                                  No documents uploaded yet
                                </p>
                                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                                  Upload your first file to start building out
                                  your document dashboard.
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        documents.map((document) => {
                          const isSelected = validSelectedIds.includes(
                            document.id,
                          );

                          return (
                            <TableRow
                              key={document.id}
                              data-state={isSelected ? "selected" : undefined}
                              className="border-border/70"
                            >
                              <TableCell className="pl-5">
                                <Checkbox
                                  aria-label={`Select ${document.displayName}`}
                                  checked={isSelected}
                                  disabled={isBusy}
                                  onCheckedChange={(checked) => {
                                    toggleDocumentSelection(
                                      document.id,
                                      checked,
                                    );
                                  }}
                                />
                              </TableCell>

                              <TableCell className="max-w-[320px]">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                    <FileTextIcon className="size-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                      {document.displayName}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {document.contentType}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="font-medium text-foreground">
                                {formatDocumentType(document)}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDocumentSize(document.size)}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatUploadDate(document.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusVariant(document.status)}
                                >
                                  {formatDocumentStatus(document.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[260px]">
                                <span
                                  className="block truncate font-mono text-xs text-muted-foreground"
                                  title={document.ownerId}
                                >
                                  {document.userFirstName +
                                    " " +
                                    document.userLastName}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
