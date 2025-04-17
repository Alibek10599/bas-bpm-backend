export interface DocumentsProvider {
  updateDocument(
    documentId: string,
    userId: string,
    fileUrl: string,
  ): Promise<void>;
}
