import { Module } from '@nestjs/common';
import { OnlyOfficeService } from './only-office.service';
import { OnlyOfficeWopiController } from './only-office.wopi.controller';
import { FILE_PROVIDER_TOKEN } from './const/file.provider.token';
import { FileProvider } from './interfaces/file.provider';
import { ConfigService } from '@nestjs/config';

@Module({})
export class OnlyOfficeModule {
  static init(fileProvider: FileProvider) {
    return {
      module: OnlyOfficeModule,
      controllers: [OnlyOfficeWopiController],
      providers: [
        {
          provide: 'HOST_URL',
          useFactory: (configService: ConfigService) => {
            return configService.get('HOST_URL');
          },
          inject: [ConfigService],
        },
        {
          provide: FILE_PROVIDER_TOKEN,
          useFactory: () => fileProvider,
        },
        OnlyOfficeService,
      ],
    };
  }
}
