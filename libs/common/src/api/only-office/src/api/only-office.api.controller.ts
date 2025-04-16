import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Document, Packer } from 'docx';
import { OnlyOfficeApiService } from './only-office.api.service';
import { OnlyOfficeCallbackDto } from '@app/common/api/only-office/src/api/dto/only-office-callback.dto';
import { OnlyOfficeAuthGuard } from '@app/common/api/only-office/src/api/guards/only-office-auth.guard';

@Controller('only-office/api')
export class OnlyOfficeApiController {
  constructor(private readonly onlyOfficeApiService: OnlyOfficeApiService) {}

  @UseGuards(OnlyOfficeAuthGuard)
  @Post('callback')
  async handleCallback(
    @Res() res: Response,
    @Body() body: OnlyOfficeCallbackDto,
  ) {
    await this.onlyOfficeApiService.handleCallback(body);

    res.status(200);
    res.send({ error: 0 });
  }

  @Get('test-doc-file')
  async getTestDocFile(@Res() res: Response) {
    const doc = new Document({
      sections: [],
    });

    const buffer = await Packer.toBuffer(doc);
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.send(buffer);
  }

  @Get('show')
  async show(@Res() res: Response, @Query('key') key: string) {
    res.send(this.onlyOfficeApiService.buildTestPage(key));
  }
}
