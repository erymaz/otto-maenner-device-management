import createLogger from '@elunic/logger';
import { LoggerModule } from '@elunic/logger-nestjs';
import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { JoiPipeModule } from 'nestjs-joi';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CustomerModule } from './customer/customer.module';
import { MIGRATION_PATH, MIGRATION_TABLE_NAME } from './definitions';
import { DeviceModule } from './device/device.module';
import { HttpExceptionFilter } from './lib/filters/http-exceptions.filter';
import { UserModule } from './user/user.module';

@Module({})
export class AppModule {
  static forApp(): DynamicModule {
    return this.buildDynamicModule({
      migrationsRun: true,
    });
  }

  static forE2E(dbName: string): DynamicModule {
    return this.buildDynamicModule({
      dbName,
      migrationsRun: false,
    });
  }

  private static buildDynamicModule({
    dbName,
    migrationsRun,
  }: {
    dbName?: string;
    migrationsRun?: boolean;
  }): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule,
        JoiPipeModule,

        I18nModule.forRootAsync({
          useFactory: () => {
            return {
              fallbackLanguage: 'en',
              parserOptions: {
                path: path.join(__dirname, '../assets/i18n/'),
              },
            };
          },
          parser: I18nJsonParser,
          resolvers: [new HeaderResolver(['x-custom-lang'])],
        }),

        LoggerModule.forRootAsync({
          useFactory: (config: ConfigService) => ({
            logger: createLogger(config.log.namespace, {
              consoleLevel: config.log.level,
              logPath: undefined,
              json: false,
            }),
          }),
          inject: [ConfigService],
        }),

        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => ({
            type: 'mysql',
            host: config.database.host,
            ssl: config.database.ssl,
            port: config.database.port,
            username: config.database.user,
            password: config.database.pass,
            database: dbName ? dbName : config.database.name,
            autoLoadEntities: true,
            migrationsTableName: MIGRATION_TABLE_NAME,
            migrations: [MIGRATION_PATH],
            namingStrategy: new SnakeNamingStrategy(),
            migrationsRun,
          }),
          inject: [ConfigService],
        }),

        DeviceModule,
        CustomerModule,
        UserModule,
        AuthModule,
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
    };
  }
}
