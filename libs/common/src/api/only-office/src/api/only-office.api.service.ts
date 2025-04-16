import { Inject, Injectable } from '@nestjs/common';
import { OnlyOfficeCallbackDto } from './dto/only-office-callback.dto';
import { JwtService } from '@nestjs/jwt';
import { documentsProviderToken } from './documents/documents.provider.token';
import { DocumentsProvider } from './documents/documents.provider';

@Injectable()
export class OnlyOfficeApiService {
  constructor(
    private jwtService: JwtService,
    @Inject(documentsProviderToken)
    private readonly documentsProvider: DocumentsProvider,
  ) {}

  async handleCallback(body: OnlyOfficeCallbackDto) {
    if (body.status === 2) {
      const key = body.key.includes('-v') ? body.key.split('-v')[0] : body.key;
      await this.documentsProvider.updateDocument(key, body.users[0], body.url);
    }
  }

  buildTestPage(key: string, version: string) {
    const cfg = {
      document: {
        fileType: 'docx',
        key: key + '-v' + version,
        title: 'temp.docx',
        url: `http://192.168.8.10:3003/documents/${key}/content?version=${version}`,
      },
      documentType: 'word',
      editorConfig: {
        callbackUrl: 'http://192.168.8.10:3003/only-office/api/callback',
        user: {
          id: '73f4c430-2a06-4380-9aa9-fb3261175ae0',
          name: 'Admin',
        },
      },
    };
    const token = this.jwtService.sign(cfg);
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document Editor</title>
    </head>
    <body style="height: 98vh;">
        <div id="placeholder"></div>
        <script src="http://192.168.8.10:8081/web-apps/apps/api/documents/api.js"></script>
        <script>
            const docEditor = new DocsAPI.DocEditor("placeholder", ${JSON.stringify(
              { ...cfg, token },
            )});
        </script>
    </body> 
    </html>  
    `;
  }
}
