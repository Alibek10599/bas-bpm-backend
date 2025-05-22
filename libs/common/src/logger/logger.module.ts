import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: (cfg: ConfigService) => {
        const level = cfg.get('LOGGER_LEVEL') ?? 'info';
        const pretty = cfg.get<boolean>('LOGGER_PRETTY') ?? false;

        const transport = pretty
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                ignore: 'pid,hostname',
              },
            }
          : undefined;

        return {
          pinoHttp: {
            transport,
            level,
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
