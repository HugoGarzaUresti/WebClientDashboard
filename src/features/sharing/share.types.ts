export type SharePermission = "VIEW";

export type ShareRecord = {
  id: string;
  documentId: string;
  sharedWithUserId: string;
  permission: SharePermission;
};
