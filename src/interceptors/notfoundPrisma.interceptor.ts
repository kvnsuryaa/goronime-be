import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    public catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exception_code = exception.code
        const message = exception.message.replace(/\n/g, '');
        console.log(`Prisma Error => (${exception_code})`, message)

        switch (exception_code) {
            case 'P2002': {
                const status = HttpStatus.CONFLICT;
                return response.status(status).json({
                    statusCode: status,
                    message: 'Conflict Data',
                    data: null,
                    error: message
                });
                break;
            }
            case 'P2025': {
                const status = HttpStatus.NOT_FOUND;
                return response.status(status).json({
                    statusCode: status,
                    message: 'Data not found',
                    data: null,
                    error: message
                });
                break;
            }
            default:
                // default 500 error code
                const status = HttpStatus.INTERNAL_SERVER_ERROR;
                return response.status(status).json({
                    statusCode: status,
                    message: 'Error',
                    data: null,
                    error: message
                });
                break;
        }
    }
}