import { Injectable } from '@nestjs/common';
import { TemplateDocument } from '../domain/models/template.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TemplatesService {
  async findOne(id: string) {
    return plainToInstance(TemplateDocument, {
      _id: '21123-213123-12312-421-4',
      name: 'Hello-world',
      text: '',
      userId: '',
    });
  }
}
