import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
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
import { LockMismatchError } from './errors/lock-mismatch.error';
import { RequestHeader } from '@app/common/decorators/request-header.decorator';
import { UpdateFileHeaders } from './validation/update-file-headers-validation.decorator';
import { LockFileResult } from './types/lock-file.result';

@Controller('only-office/wopi/files')
export class OnlyOfficeController {
  constructor(
    private readonly onlyOfficeService: OnlyOfficeService,
    @Inject('HOST_URL') private readonly hostUrl: string,
  ) {}

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/checkfileinfo/
   * */
  @Get(':fileId')
  async checkFileInfo(
    @Param('fileId') fileId: string,
    @RequestHeader(CheckFileInfoHeaders)
    checkFileInfoHeaders: CheckFileInfoHeaders,
  ): Promise<CheckFileResponseDto> {
    return this.onlyOfficeService.checkFileInfo(fileId);
  }

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/getfile/
   * */
  @Get(':fileId/contents')
  async getFile(
    @Param('fileId') fileId: string,
    @RequestHeader(GetFileHeaders) getFileHeaders: GetFileHeaders,
    @Res() res: Response,
  ): Promise<void> {
    const { file, version } = await this.onlyOfficeService.getFile(fileId);
    res.setHeader('x-wopi-ItemVersion', version);
    if (
      getFileHeaders.maxExpectedSize &&
      file.length > +getFileHeaders.maxExpectedSize
    ) {
      res.status(412);
      res.send();
      return;
    }
    res.send(file);
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
    @Res() res: Response,
    @Param('fileId') fileId: string,
    @UpdateFileHeaders()
    headers: LockFileHeader | PutRelativeFileHeaders | RenameFileHeaders,
    @Body() buffer?: Buffer,
    @Query('access_token') accessToken?: string,
  ) {
    switch (headers.operation) {
      case 'LOCK':
        return this.onlyOfficeService
          .lockFile(fileId, headers.lockId)
          .then((result) => {
            return this.lockFileResponse(res, result);
          });
      case 'UNLOCK':
        return this.onlyOfficeService
          .unlockFile(fileId, headers.lockId)
          .then((result) => {
            return this.lockFileResponse(res, result);
          });
      case 'REFRESH_LOCK':
        return this.onlyOfficeService
          .refreshLock(fileId, headers.lockId)
          .then((result) => {
            return this.lockFileResponse(res, result);
          });
      case 'RENAME_FILE':
        return this.onlyOfficeService
          .renameFile(fileId, headers.requestedName, headers.lockId)
          .then((result) => {
            res.header('X-WOPI-Lock', result.lockId);
            res.send({ Name: result.newName });
          });
      case 'PUT_RELATIVE':
        return this.onlyOfficeService
          .putRelativeFile(
            fileId,
            buffer,
            headers.suggestedTarget,
            headers.lockId,
            +headers.size,
            Boolean(headers.fileConversion),
          )
          .then((result) => {
            res.header('X-WOPI-Lock', result.lockId);
            res.send({
              Name: result.relatedFileId,
              Url: this.buildUrl(accessToken, result.relatedFileId),
              HostViewUrl: '',
              HostEditUrl: '',
            });
          });
    }
  }

  private buildUrl(accessKey: string, fileId: string) {
    return `${this.hostUrl}/only-office/wopi/files/${fileId}?access_token=${accessKey}`;
  }

  private async lockFileResponse(res: Response, result: LockFileResult) {
    res.header('X-WOPI-Lock', result.lockId);
    res.header('X-WOPI-ItemVersion', result.version);
    res.send('OK');
  }

  /**
   * https://api.onlyoffice.com/docs/docs-api/using-wopi/wopi-rest-api/putfile/
   * */
  @Post(':fileId/contents')
  async putFile(
    @Param('fileId') fileId: string,
    @Body() buffer: Buffer,
    @RequestHeader(PutFileHeaders) putFileHeaders: PutFileHeaders,
    @Res() res: Response,
  ) {
    const result = await this.onlyOfficeService
      .putFile(
        fileId,
        buffer,
        {
          operation: putFileHeaders.operation,
          editors: putFileHeaders.editors?.split(','),
          isModifiedByUser: Boolean(putFileHeaders.isModifiedByUser),
          isAutoSave: Boolean(putFileHeaders.isAutosave),
          isExitSave: Boolean(putFileHeaders.isExitSave),
        },
        putFileHeaders.lockId,
      )
      .catch((err) => {
        if (err instanceof LockMismatchError) {
          return err;
        }
        throw new Error(err.message);
      });

    if (result instanceof LockMismatchError) {
      res.setHeader('X-WOPI-Lock', result.lockId);
      res.status(409);
      res.send(result.message);
      return;
    }

    res.setHeader('X-WOPI-ItemVersion', result.version);
    res.status(200);
    res.send();
  }
}
