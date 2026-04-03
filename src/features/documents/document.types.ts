export type DocumentStatus = "PENDING" | "READY" | "FAILED";

export type DocumentRecord = {
  id: string;
  ownerId: string;
  displayName: string;
  originalFilename: string;
  contentType: string;
  size: number;
  storageKey: string;
  status: DocumentStatus;
};
