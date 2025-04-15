import { Module } from '@nestjs/common';
import { OnlyOfficeApiService } from './only-office.api.service';
import { OnlyOfficeApiController } from '@app/common/api/only-office/src/api/only-office.api.controller';
import { JwtModule } from '@nestjs/jwt';
import { OnlyOfficeAuthGuard } from '@app/common/api/only-office/src/api/guards/only-office-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'my_jwt_secret',
    }),
  ],
  controllers: [OnlyOfficeApiController],
  providers: [OnlyOfficeAuthGuard, OnlyOfficeApiService],
})
export class OnlyOfficeApiModule {}
