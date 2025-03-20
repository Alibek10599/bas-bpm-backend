import { Module } from '@nestjs/common';
import { TemplatesService } from './application/templates.service';
import { TEMPLATES_REPOSITORY_TOKEN } from './domain/repository/templates.repository.token';
import { TemplatesLocalRepository } from './infrastructure/persistence/local/templates.local.repository';

@Module({
  providers: [
    {
      provide: TEMPLATES_REPOSITORY_TOKEN,
      useClass: TemplatesLocalRepository,
    },
    TemplatesService,
  ],
  exports: [TemplatesService],
})
export class TemplatesModule {}
