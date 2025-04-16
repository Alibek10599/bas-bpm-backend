import { DocumentsProvider } from '@app/common/api/only-office';
import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { Document } from '../documents/infrastructure/database/postgres/entities/document.entity';

@Injectable()
export class TestDocumentProvider implements DocumentsProvider {
  constructor(
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async updateDocument(
    documentId: string,
    userId: string,
    fileUrl: string,
  ): Promise<void> {
    console.log(
      await this.dataSource
        .getRepository(Document)
        .findOne({ where: { id: documentId } }),
    );
  }
}
