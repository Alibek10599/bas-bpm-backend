import { DynamicModule, Module } from '@nestjs/common';
import { OnlyOfficeApiService } from './only-office.api.service';
import { OnlyOfficeApiController } from './only-office.api.controller';
import { JwtModule } from '@nestjs/jwt';
import { OnlyOfficeAuthGuard } from './guards/only-office-auth.guard';
import { documentsProviderToken } from './documents/documents.provider.token';
import { OnlyOfficeApiModuleOptions } from '@app/common/api/only-office/src/api/only-office.api.module.options';

@Module({})
export class OnlyOfficeApiModule {
  static forRoot(options: OnlyOfficeApiModuleOptions): DynamicModule {
    return {
      module: OnlyOfficeApiModule,
      imports: [
        JwtModule.register({
          secret: options.jwtSecret,
        }),
        ...(options.imports ?? []),
      ],
      controllers: [OnlyOfficeApiController],
      providers: [
        options.documentsProvider,
        {
          provide: documentsProviderToken,
          useClass: options.documentsProvider,
        },
        OnlyOfficeAuthGuard,
        OnlyOfficeApiService,
      ],
    };
  }
}
