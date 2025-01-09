import {
    Injectable,
    Logger
  } from '@nestjs/common';
import { CustomValidationException } from '../utils/customValidation';
  
  @Injectable()
  export class ResponseHandlerService {
    loggerFrom: string = '';
    logger = new Logger();
  
    handleExceptions(code: string, message: string): never {
      this.logger.error(code,message);
      throw new CustomValidationException([], {
        message,
        code,
        state: 'unsuccess',
      });
    }


    handleSuccess<T>(data: T[], message: string, item: T) {
      const response = {
        items: data,
        item,
        state: 'success',
        code: '',
        message: message
      };

      return response;
    }
  }