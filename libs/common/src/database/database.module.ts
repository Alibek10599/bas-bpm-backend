import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('POSTGRES_URL'),
        entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
        logging: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities: any[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
