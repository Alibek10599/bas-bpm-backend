import { DocumentsProvider } from '@app/common/api/only-office';
import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { Document } from '../documents/infrastructure/database/postgres/entities/document.entity';
import { DocumentVersions } from '../documents/infrastructure/database/postgres/entities/document-versions.entity';
import { FilesService } from '../files/application/files.service';
import Axios from 'axios';

@Injectable()
export class TestDocumentProvider implements DocumentsProvider {
  constructor(
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
    private readonly filesService: FilesService,
  ) {}

  async updateDocument(
    documentId: string,
    userId: string,
    fileUrl: string,
  ): Promise<void> {
    return await this.dataSource.transaction(async (em) => {
      const document = await em.findOne(Document, {
        relations: ['currentVersion'],
        where: { id: documentId },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      const fileData = await this.getFile(fileUrl);

      const { fileId } = await this.filesService.saveFileInTransaction(
        {
          name: document.name,
          type: fileData.type,
          buffer: fileData.buffer,
          userId: userId,
          tenantId: '',
        },
        em,
      );

      const lastVersion = document.currentVersion;

      document.currentVersion = await em.save(DocumentVersions, {
        file: { id: fileId },
        document: { id: documentId },
        version: (lastVersion?.version ?? 0) + 1,
        createdBy: userId,
      });

      await em.save(document);
    });
  }

  private async getFile(
    fileUrl: string,
  ): Promise<{ buffer: Buffer; type: string }> {
    const data = await Axios.get(fileUrl, { responseType: 'arraybuffer' });
    return {
      buffer: Buffer.from(data.data),
      type: data.headers['content-type'],
    };
  }
}
