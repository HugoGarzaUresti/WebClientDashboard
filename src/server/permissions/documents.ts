export function canAccessDocument(ownerId: string, userId: string) {
  return ownerId === userId;
}
