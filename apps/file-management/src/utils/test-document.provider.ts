import { DocumentsProvider } from '@app/common/api/only-office';

export class TestDocumentProvider implements DocumentsProvider {
  async updateDocument(
    documentId: string,
    userId: string,
    fileUrl: string,
  ): Promise<void> {
    return undefined;
  }
}
