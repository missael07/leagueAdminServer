import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { CustomValidationException } from './customValidation';

@Catch(CustomValidationException)
export class CustomValidationExceptionFilter implements ExceptionFilter {
  catch(exception: CustomValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const validationErrors = exception.validationErrors;

    response.status(status).json({
      Data: null,
      State: exception.state,
      Code: exception.code,
      Message: exception.message || 'Something was wrong.',
      ValidationResults: {
        IsValid: false,
        InvalidItems: validationErrors.map((error: ValidationError) => ({
          IsValid: false,
          Message: Object.values(error.constraints).join(', '),
          ItemName: error.property,
        })),
      },
    });
  }
}