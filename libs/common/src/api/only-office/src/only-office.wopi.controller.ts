import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OnlyOfficeService } from './only-office.service';
import { CheckFileInfoHeaders } from './headers/check-file-info.headers';
import { GetFileHeaders } from './headers/get-file.headers';
import { PutFileHeaders } from './headers/put-file.headers';
import { LockFileHeader } from './headers/lock-file.headers';
import { PutRelativeFileHeaders } from './headers/put-relative-file.headers';
import { RenameFileHeaders } from './headers/rename-file.headers';
import { CheckFileResponseDto } from './dto/check-file.response.dto';

@Controller('only-office/wopi/files')
export class OnlyOfficeWopiController {
  constructor(private readonly onlyOfficeService: OnlyOfficeService) {}

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/checkfileinfo/
   * */
  @Get(':fileId')
  async checkFileInfo(
    @Param('fileId') fileId: string,
    @Headers() checkFileInfoHeaders: CheckFileInfoHeaders,
  ): Promise<CheckFileResponseDto> {
    return this.onlyOfficeService.checkFileInfo(fileId);
  }

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/getfile/
   * */
  @Get(':fileId/contents')
  async getFile(
    @Param('fileId') fileId: string,
    @Headers() getFileHeaders: GetFileHeaders,
    @Res() res: Response,
  ): Promise<Buffer> {
    const { file, version } = await this.onlyOfficeService.getFile(fileId);
    res.setHeader('X-WOPI-ItemVersion', version);
    if (file.length > +getFileHeaders['X-WOPI-MaxExpectedSize']) {
      res.status(412);
    }
    return file;
  }

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/lock/
   *
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/unlock/
   *
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/putrelativefile/
   *
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/refreshlock/
   *
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/renamefile/
   * */
  @Post(':fileId')
  async updateFile(
    @Param('fileId') fileId: string,
    @Headers()
    headers: LockFileHeader | PutRelativeFileHeaders | RenameFileHeaders,
    @Body() buffer?: Buffer,
  ) {
    await this.onlyOfficeService.updateFile(fileId, {
      action: headers['X-WOPI-Override'],
      buffer,
      suggestedTarget: headers['X-WOPI-SuggestedTarget'],
      fileSize: +headers['X-WOPI-Size'],
      lockId: headers['X-WOPI-Lock'],
      requestedName: headers['X-WOPI-RequestedName'],
      fileConversion: Boolean(headers['X-WOPI-FileConversion']),
    });
  }

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/putfile/
   * */
  @Post(':fileId/contents')
  async putFile(
    @Param('fileId') fileId: string,
    @Body() buffer: Buffer,
    @Headers() putFileHeaders: PutFileHeaders,
    @Res() res: Response,
  ) {
    const result = await this.onlyOfficeService.putFile(
      fileId,
      buffer,
      {
        operation: putFileHeaders['X-WOPI-Override'],
        editors: putFileHeaders['X-WOPI-Editors']?.split(','),
        modifiedByUser: putFileHeaders['X-LOOL-WOPI-IsModifiedByUser'],
        isAutoSave: Boolean(putFileHeaders['X-LOOL-WOPI-IsAutosave']),
        isExitSave: Boolean(putFileHeaders['X-LOOL-WOPI-IsExitSave']),
      },
      putFileHeaders['X-WOPI-Lock'],
    );

    const headers = new Map([['X-WOPI-ItemVersion', result.version]]);

    if (result.lockId) {
      headers.set('X-WOPI-Lock', result.lockId);
      headers.set('X-WOPI-LockFailureReason', result.locReason);
      res.status(409);
    }

    res.setHeaders(headers);
  }
}
