import { Injectable } from '@nestjs/common';
import { OnlyOfficeCallbackDto } from '@app/common/api/only-office/src/api/dto/only-office-callback.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OnlyOfficeApiService {
  constructor(private jwtService: JwtService) {}

  async handleCallback(body: OnlyOfficeCallbackDto) {
    console.log('Callback received:', body);
  }

  buildTestPage() {
    const key = '12345678-90l';
    const token = this.jwtService.sign({
      document: {
        fileType: 'docx',
        key: key,
        title: 'temp.docx',
        url: 'http://192.168.0.101:3003/only-office/api/test-doc-file',
      },
      documentType: 'word',
      editorConfig: {
        callbackUrl: 'http://192.168.0.101:3003/only-office/api/callback',
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
        <div id="placeholder" style="width: 100%; height: 90vh;"></div>
        <script src="http://localhost/web-apps/apps/api/documents/api.js"></script>
        <script>
            const docEditor = new DocsAPI.DocEditor("placeholder", {
                token: "${token}",
                document: {
                    fileType: "docx",
                    key: "${key}",
                    title: "temp.docx",
                    url: "http://192.168.0.101:3003/only-office/api/test-doc-file",
                },
                documentType: "word",
                editorConfig: {
                    callbackUrl: "http://192.168.0.101:3003/only-office/api/callback",
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
