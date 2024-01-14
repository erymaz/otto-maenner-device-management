import { LogService } from '@elunic/logger';
import { InjectLogger } from '@elunic/logger-nestjs';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import {
  AlreadyInUseError,
  ArgumentError,
  ArgumentNullError,
  AuthenticationRequiredError,
  NotFoundError,
  NotPermittedError,
} from 'common-errors';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

import { asError } from '../data-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectLogger(HttpExceptionFilter.name) private readonly logger: LogService,
    private readonly i18n: I18nService
  ) { }

  async catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (this.logger) {
      this.logger.error([err, err.stack]);
    }

    let error: HttpException;
    if (err instanceof HttpException) {
      err.message = await this.getMessage(ctx, err.message);
      error = err;
    } else if (err instanceof ArgumentError || err instanceof ArgumentNullError) {
      error = new BadRequestException(this.getMessage(ctx, err.message));
    } else if (err instanceof AlreadyInUseError) {
      error = new ConflictException(this.getMessage(ctx, err.message));
    } else if (err instanceof AuthenticationRequiredError) {
      error = new UnauthorizedException(this.getMessage(ctx, err.message));
    } else if (err instanceof NotFoundError) {
      error = new NotFoundException(this.getMessage(ctx, err.message));
    } else if (err instanceof NotPermittedError) {
      error = new ForbiddenException(this.getMessage(ctx, err.message));
    } else {
      error = new BadRequestException(this.getMessage(ctx, err.message));
    }
    response.status(error.getStatus()).json(asError(error));
  }

  async getMessage(ctx: HttpArgumentsHost, message: string): Promise<string> {
    if (ctx.getRequest().i18nLang) {
      return await this.i18n.t(message, { lang: ctx.getRequest().i18nLang });
    }
    return message;
  }
}
