import { Injectable } from '@nestjs/common';
import { TemplateDocument } from '../domain/models/template.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TemplatesService {
  async findOne(id: string) {
    return plainToInstance(TemplateDocument, {
      _id: '21123-213123-12312-421-4',
      name: 'Hello-world',
      title: 'Hello-world',
      text: `<table>
                <thead>
                    <tr><td>Курьер</td><td>Кол-во доставок</td></tr>
                </thead>
                <tbody>
                    <tr><td>Руслан</td><td>10</td></tr>
                </tbody>
             </table>`,
      userId: '',
    });
  }
}
