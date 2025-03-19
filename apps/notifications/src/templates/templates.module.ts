import { Module } from '@nestjs/common';
import { TemplatesService } from './application/templates.service';

@Module({
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
