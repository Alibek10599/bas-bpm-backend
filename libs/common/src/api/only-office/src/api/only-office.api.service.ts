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
    console.log(body);
    if (body.status === 2) {
      await this.documentsProvider.updateDocument(
        body.key,
        body.users[0],
        body.url,
      );
    }
  }

  buildTestPage(key: string) {
    const token = this.jwtService.sign({
      document: {
        fileType: 'docx',
        key: key,
        title: 'temp.docx',
        url: `http://192.168.8.10:3003/documents/${key}/content`,
      },
      documentType: 'word',
      editorConfig: {
        callbackUrl: 'http://192.168.8.10:3003/only-office/api/callback',
        user: {
          id: '73f4c430-2a06-4380-9aa9-fb3261175ae0',
          name: 'Admin',
        },
      },
    });
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document Editor</title>
    </head>
    <body style="height: 98vh;">
        <div id="placeholder"></div>
        <script src="http://localhost:8081/web-apps/apps/api/documents/api.js"></script>
        <script>
            const docEditor = new DocsAPI.DocEditor("placeholder", {
                token: "${token}",
                document: {
                    fileType: "docx",
                    key: "${key}",
                    title: "temp.docx",
                    url: "http://192.168.8.10:3003/documents/${key}/content",
                },
                documentType: "word",
                editorConfig: {
                    callbackUrl: "http://192.168.8.10:3003/only-office/api/callback",
                    user: {
                      id: "73f4c430-2a06-4380-9aa9-fb3261175ae0",
                      name: "Admin"
                    },
                }
            });
        </script>
    </body> 
    </html>  
    `;
  }
}
