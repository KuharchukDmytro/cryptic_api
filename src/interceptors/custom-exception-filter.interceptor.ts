import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('🚀 ~ Exception Filter ~ exception:', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    switch (true) {
      case exception instanceof PrismaClientKnownRequestError:
      case exception instanceof PrismaClientValidationError:
        return response.status(status).json({
          statusCode: status,
          messages: ['Internal server error'],
          timestamp: new Date().toISOString(),
          path: request.url,
          additional: {
            ...exception,
            messages: exception?.message,
          },
        });

      case exception instanceof HttpException:
        const exceptionResponse = exception.getResponse();
        let messages: string[] | string =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as Error).message || 'Internal server error';

        messages = Array.isArray(messages) ? messages : [messages];

        return response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          messages,
          additional: {},
        });

      default:
        return response.status(500).json({
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: request.url,
          messages: ['Internal server error'],
          additional: {},
        });
    }
  }
}
