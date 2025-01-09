import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface CustomValidationExceptionOptions {
  message?: string;
  code?: string;
  state?: string;
}

export class CustomValidationException extends HttpException {
  public validationErrors: ValidationError[];
  public message: string;
  public code: string;
  public state: string;

  constructor(
    validationErrors: ValidationError[],
    options: CustomValidationExceptionOptions = {}
  ) {
    const response = {
      Data: null,
      State: options.state || 'invalid',
      Code: options.code || 'valid0001',
      Message: options.message || 'Validation failed',
      ValidationResults: {
        IsValid: false,
        InvalidItems: validationErrors.map((error) => ({
          IsValid: false,
          Message: Object.values(error.constraints).join(', '),
          ItemName: error.property,
        })),
      },
    };

    super(response, HttpStatus.BAD_REQUEST);

    this.validationErrors = validationErrors;
    this.message = options.message || 'Validation failed';
    this.code = options.code || 'VALIDATION_ERROR';
    this.state = options.state || 'invalid';
  }
}